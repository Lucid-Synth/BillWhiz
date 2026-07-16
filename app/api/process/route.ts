import { NextRequest, NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";
import Groq from "groq-sdk";
import { db } from "@/app/drizzle/db/drizzle";
import { invoiceAnalysis } from "@/app/drizzle/schema";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

// In-memory processing tracker
const activeRequests = new Map();

export async function POST(req: NextRequest) {
  const dbRecordId = crypto.randomUUID();

  try {
    // request isolation
    const requestId = req.nextUrl.searchParams.get("requestId");

    if (!requestId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing requestId",
        },
        { status: 400 },
      );
    }

    // prevent duplicate processing
    if (activeRequests.has(requestId)) {
      return NextResponse.json(
        {
          success: false,
          error: "This request is already processing",
        },
        { status: 409 },
      );
    }

    activeRequests.set(requestId, true);

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const userId = session?.user?.id;

    if (!userId) {
      activeRequests.delete(requestId);
      return NextResponse.json(
        {
          success: false,
          error: "User not authenticated",
        },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { pdfUrl } = body;
    if (!pdfUrl) {
      activeRequests.delete(requestId);

      return NextResponse.json(
        {
          success: false,
          error: "PDF URL is required",
        },
        { status: 400 },
      );
    }

    console.log(`[${requestId}] Starting invoice analysis`);

    await db.insert(invoiceAnalysis).values({
      id: dbRecordId,
      userId: userId,
      requestId: requestId,
      pdfUrl: pdfUrl,
      status: "processing",
    });

    // Fetch PDF
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch PDF");
    }

    // Convert PDF
    const arrayBuffer = await response.arrayBuffer();

    const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer));

    // Extract text
    const { text } = await extractText(pdf);

    // Clean extracted text
    const cleanedText = (Array.isArray(text) ? text.join("\n") : text)
      .replace(/\s+/g, " ")
      .replace(/[^\x20-\x7E\n]/g, "")
      .trim();

    // Prevent token explosion
    const truncatedText = cleanedText.slice(0, 12000);

    // Prompt
    const SYSTEM_PROMPT = `
You are a highly accurate invoice analysis AI.

Your tasks:
1. Analyze invoice text
2. Explain charges clearly
3. Detect anomalies
4. Return STRICT JSON ONLY

Rules:
- Never hallucinate values
- Never guess missing fields
- Use null if unknown
- Detect duplicate charges
- Detect suspicious pricing
- Detect subtotal mismatches
- Detect unusual tax calculations
- Keep explanations concise
- No markdown
- No extra text
`;

    const USER_PROMPT = `
Analyze this invoice.

INVOICE TEXT:
${truncatedText}

Return JSON in this exact schema:

{
  "invoice_summary": {
    "vendor_name": "",
    "invoice_number": "",
    "invoice_date": "",
    "due_date": "",
    "currency": "",
    "subtotal": 0,
    "tax": 0,
    "total": 0
  },
  "line_items": [
    {
      "item": "",
      "quantity": "",
      "unit_price": 0,
      "total_price": 0,
      "category": "",
      "explanation": ""
    }
  ],
  "anomalies": [
    {
      "type": "",
      "severity": "low | medium | high",
      "description": "",
      "confidence": 0
    }
  ],
  "customer_friendly_summary": ""
}

Rules:
- Return ONLY valid JSON
`;

    // Groq call
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: USER_PROMPT,
        },
      ],
    });

    const rawContent = completion.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error("No AI response");
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(rawContent);
    } catch (err) {
      console.error("Invalid JSON from AI:", rawContent);

      throw new Error("AI returned invalid JSON");
    }

    const summary = parsedResult.invoice_summary || {};
    const lineItems = parsedResult.line_items || [];
    const anomalies = parsedResult.anomalies || [];

    await db
      .update(invoiceAnalysis)
      .set({
        status: "completed",
        vendorName: summary.vendor_name || null,
        invoiceNumber: summary.invoice_number || null,
        invoiceDate: summary.invoice_date || null,
        dueDate: summary.due_date || null,
        currency: summary.currency || null,
        total: summary.subtotal || null,
        anomalyCount: anomalies.length,
        lineItemCount: lineItems.length,
        summarySnippet: parsedResult.customer_friendly_summary || null,
        aiResponse: parsedResult,
      })
      .where(eq(invoiceAnalysis.id, dbRecordId));

    console.log(`[${requestId}] Completed and stored in DB`);

    activeRequests.delete(requestId);

    return NextResponse.json({
      success: true,
      requestId,
      data: parsedResult,
    });
  } catch (error: any) {
    console.error("Invoice Analysis Error:", error);

    try {
      await db
        .update(invoiceAnalysis)
        .set({
          status: "failed",
          errorMessage: error?.message || "Failed to analyze invoice",
        })
        .where(eq(invoiceAnalysis.id, dbRecordId));
    } catch (dbErr) {
      console.error("Failed to write error state to DB", dbErr);
    }

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to analyze invoice",
      },
      { status: 500 },
    );
  }
}
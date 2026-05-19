import { NextRequest, NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

// In-memory processing tracker
const activeRequests = new Map();

export async function POST(req: NextRequest) {
  try {
    // request isolation
    const requestId =
      req.nextUrl.searchParams.get(
        "requestId"
      );

    if (!requestId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing requestId",
        },
        { status: 400 }
      );
    }

    // prevent duplicate processing
    if (activeRequests.has(requestId)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This request is already processing",
        },
        { status: 409 }
      );
    }

    activeRequests.set(requestId, true);

    const body = await req.json();

    const { pdfUrl } = body;

    if (!pdfUrl) {
      activeRequests.delete(requestId);

      return NextResponse.json(
        {
          success: false,
          error: "PDF URL is required",
        },
        { status: 400 }
      );
    }

    console.log(
      `[${requestId}] Starting invoice analysis`
    );

    // Fetch PDF
    const response = await fetch(pdfUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch PDF");
    }

    // Convert PDF
    const arrayBuffer =
      await response.arrayBuffer();

    const pdf = await getDocumentProxy(
      new Uint8Array(arrayBuffer)
    );

    // Extract text
    const { text } = await extractText(pdf);

    // Clean extracted text
    const cleanedText = (
      Array.isArray(text)
        ? text.join("\n")
        : text
    )
      .replace(/\s+/g, " ")
      .replace(/[^\x20-\x7E\n]/g, "")
      .trim();

    // Prevent token explosion
    const truncatedText =
      cleanedText.slice(0, 12000);

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
    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
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

    const rawContent =
      completion.choices?.[0]?.message
        ?.content;

    if (!rawContent) {
      throw new Error("No AI response");
    }

    let parsedResult;

    try {
      parsedResult =
        JSON.parse(rawContent);
    } catch (err) {
      console.error(
        "Invalid JSON from AI:",
        rawContent
      );

      throw new Error(
        "AI returned invalid JSON"
      );
    }

    console.log(
      `[${requestId}] Completed`
    );

    activeRequests.delete(requestId);

    return NextResponse.json({
      success: true,
      requestId,
      data: parsedResult,
    });
  } catch (error: any) {
    console.error(
      "Invoice Analysis Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Failed to analyze invoice",
      },
      { status: 500 }
    );
  }
}
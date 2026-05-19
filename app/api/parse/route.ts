import { NextRequest, NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pdfUrl } = body;

    if (!pdfUrl) {
      return NextResponse.json(
        { error: "PDF URL is required" },
        { status: 400 }
      );
    }

    const response = await fetch(pdfUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch PDF");
    }

    const arrayBuffer = await response.arrayBuffer();
    const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer));

    const { text } = await extractText(pdf);

    return NextResponse.json({
      success: true,
      text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to parse PDF",
      },
      { status: 500 }
    );
  }
}
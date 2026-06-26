import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/app/drizzle/db/drizzle";
import { invoiceAnalysis } from "@/app/drizzle/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const history = await db
    .select({
      id: invoiceAnalysis.id,
      vendor_name: invoiceAnalysis.vendorName,
      invoice_number: invoiceAnalysis.invoiceNumber,
      total: invoiceAnalysis.total,
      currency: invoiceAnalysis.currency,
      date: invoiceAnalysis.invoiceDate,
      anomaly_count: invoiceAnalysis.anomalyCount,
      line_item_count: invoiceAnalysis.lineItemCount,
      summary_snippet: invoiceAnalysis.summarySnippet,
      status: invoiceAnalysis.status,
    })
    .from(invoiceAnalysis)
    .where(eq(invoiceAnalysis.userId, session.user.id))
    .orderBy(desc(invoiceAnalysis.createdAt));

  return NextResponse.json({
    success: true,
    history,
  });
}
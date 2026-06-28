import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import InvoiceDetail from "./InvoiceDetail";
import { db } from "@/app/drizzle/db/drizzle";
import { invoiceAnalysis } from "@/app/drizzle/schema";
import { eq } from "drizzle-orm";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/unauthorized");
  }

  const { slug } = await params;

  const invoice = await db.query.invoiceAnalysis.findFirst({
    where: eq(invoiceAnalysis.id, slug),
  });

  if (!invoice || invoice.userId !== session.user.id) {
    return (
      <div className="px-6 py-8 max-w-5xl mx-auto">
        <p className="text-sm text-white/30">Invoice not found</p>
      </div>
    );
  }

  const formattedInvoice = {
    id: invoice.id,
    vendorName: invoice.vendorName,
    invoiceNumber: invoice.invoiceNumber,
    total: invoice.total?.toString() ?? null,
    currency: invoice.currency,
    date: invoice.invoiceDate,
    anomalyCount: invoice.anomalyCount,
    lineItemCount: invoice.lineItemCount,
    summarySnippet: invoice.summarySnippet,
    status: invoice.status,
    aiResponse: invoice.aiResponse as any,
    createdAt: invoice.createdAt,
  };

  return <InvoiceDetail invoice={formattedInvoice} />;
}
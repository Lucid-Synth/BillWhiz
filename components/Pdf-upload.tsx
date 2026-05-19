"use client";

import { useState } from "react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

type InvoiceResult = {
  invoice_summary: {
    vendor_name: string | null;
    invoice_number: string | null;
    invoice_date: string | null;
    due_date: string | null;
    currency: string | null;
    subtotal: number | null;
    tax: number | null;
    total: number | null;
  };
  line_items: {
    item: string;
    quantity: string;
    unit_price: number;
    total_price: number;
    category: string;
    explanation: string;
  }[];
  anomalies: {
    type: string;
    severity: string;
    description: string;
    confidence: number;
  }[];
  customer_friendly_summary: string;
};

export default function PdfUploader() {
  const [loading, setLoading] = useState(false);

  const [invoiceData, setInvoiceData] =
    useState<InvoiceResult | null>(null);

  const handleParsePdf = async (pdfUrl: string) => {
    try {
      setLoading(true);

      const response = await fetch("/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Failed to process invoice"
        );
      }

      setInvoiceData(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <UploadButton<OurFileRouter, "pdfUploader">
        endpoint="pdfUploader"
        onClientUploadComplete={async (res) => {
          const pdfUrl =
            res?.[0]?.serverData?.fileUrl;

          if (!pdfUrl) return;

          await handleParsePdf(pdfUrl);
        }}
      />

      {loading && (
        <p className="text-sm text-gray-500">
          Analyzing invoice...
        </p>
      )}

      {invoiceData && (
        <div className="space-y-6 border rounded-xl p-6">
          {/* Summary */}
          <div>
            <h2 className="text-xl font-bold">
              Invoice Summary
            </h2>

            <div className="mt-2 space-y-1 text-sm">
              <p>
                Vendor:{" "}
                {invoiceData.invoice_summary.vendor_name}
              </p>

              <p>
                Invoice #:{" "}
                {
                  invoiceData.invoice_summary
                    .invoice_number
                }
              </p>

              <p>
                Total:{" "}
                {invoiceData.invoice_summary.currency}{" "}
                {invoiceData.invoice_summary.total}
              </p>
            </div>
          </div>

          {/* Customer Summary */}
          <div>
            <h3 className="font-semibold">
              AI Explanation
            </h3>

            <p className="text-sm text-gray-700 mt-2">
              {
                invoiceData.customer_friendly_summary
              }
            </p>
          </div>

          {/* Line Items */}
          <div>
            <h3 className="font-semibold">
              Line Items
            </h3>

            <div className="mt-4 space-y-4">
              {invoiceData.line_items.map(
                (item, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4"
                  >
                    <p className="font-medium">
                      {item.item}
                    </p>

                    <p className="text-sm text-gray-600">
                      {item.explanation}
                    </p>

                    <p className="text-sm mt-2">
                      Qty: {item.quantity}
                    </p>

                    <p className="text-sm">
                      Total: {item.total_price}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Anomalies */}
          <div>
            <h3 className="font-semibold text-red-500">
              Anomalies Detected
            </h3>

            {invoiceData.anomalies.length === 0 ? (
              <p className="text-sm mt-2">
                No anomalies detected.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {invoiceData.anomalies.map(
                  (anomaly, index) => (
                    <div
                      key={index}
                      className="border border-red-200 rounded-lg p-4"
                    >
                      <p className="font-medium">
                        {anomaly.type}
                      </p>

                      <p className="text-sm">
                        {anomaly.description}
                      </p>

                      <p className="text-xs mt-2">
                        Severity:{" "}
                        {anomaly.severity}
                      </p>

                      <p className="text-xs">
                        Confidence:{" "}
                        {anomaly.confidence}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
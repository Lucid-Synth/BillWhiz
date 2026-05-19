"use client";

import { useState } from "react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export default function PdfUploader() {
  const [loading, setLoading] = useState(false);
  const [pdfText, setPdfText] = useState("");

  const handleParsePdf = async (pdfUrl: string) => {
    try {
      setLoading(true);

      const response = await fetch("/api/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfUrl,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPdfText(data.text);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Failed to parse PDF", error);
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
          Parsing PDF...
        </p>
      )}

      {pdfText && (
        <div className="border rounded-xl p-4 max-h-[500px] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">
            Extracted PDF Text
          </h2>

          <pre className="whitespace-pre-wrap text-sm">
            {pdfText}
          </pre>
        </div>
      )}
    </div>
  );
}
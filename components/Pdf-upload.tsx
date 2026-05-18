"use client"

import { UploadButton } from "@uploadthing/react"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

export default function PdfUpload(){
    return(
        <div>
            <UploadButton<OurFileRouter, "pdfUploader">
                endpoint="pdfUploader"
                onClientUploadComplete={(res) => {
                    console.log("Uploaded:", res);

                    alert("Upload complete");
                }}
                onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);;
                }}
                />
        </div>
    )
}
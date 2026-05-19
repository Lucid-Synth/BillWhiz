import { createUploadthing, type FileRouter } from "uploadthing/next";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({
    pdf: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // Get current session
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session) {
        throw new Error("Unauthorized");
      }

      return {
        userId: session.user.id,
        userEmail: session.user.email,
      };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      console.log("Uploaded by:", metadata.userEmail);
      console.log("File URL:", file.ufsUrl)

      return {
        fileUrl: file.ufsUrl,
        uploadedBy: metadata.userId,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
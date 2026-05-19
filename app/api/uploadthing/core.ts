import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({
    pdf: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(async ({ file }) => {
    console.log("File Url:" + file.ufsUrl);

    return {
      FileUrl: file.ufsUrl
    }
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
import { NextResponse } from "next/server";
import { createWorker } from "tesseract.js";
import path from "path";

export async function GET() {
  const worker = await createWorker("eng", 1, {
    workerPath: path.resolve(
      process.cwd(),
      "node_modules/tesseract.js/src/worker-script/node/index.js"
    ),
  });

  const {
    data: { text },
  } = await worker.recognize(
    "https://tesseract.projectnaptha.com/img/eng_bw.png"
  );

  await worker.terminate();

  return NextResponse.json({
    message: text,
  });
}
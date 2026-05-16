import { NextResponse } from "next/server";
import { extractText,getDocumentProxy } from "unpdf";

const buffer = await fetch('https://pdfobject.com/pdf/sample.pdf')
  .then(res => res.arrayBuffer())

const pdf = await getDocumentProxy(new Uint8Array(buffer))
const { text } = await extractText(pdf)

console.log(text)


export async function GET(request: Request){
    return NextResponse.json({message: "pdf api route!!"},{status:200});
}
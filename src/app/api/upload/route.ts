import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { pc } from "@/lib/pinecone";
import { Md5 } from "ts-md5";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    //1、pdf to docs
    let docs = await pdfToDocs(file);
    //2、split docs
    let chunks = await Promise.all(docs.map((doc) => splitDocs(doc)));
    //3、上传到vector store
    await Promise.all(chunks.map((chunk) => uploadToDb(chunk)));
    return NextResponse.json({
      message: "上传成功",
      success: true,
    });
  } catch (e) {
    return NextResponse.json({
      message: "上传失败",
      success: false,
    });
  }
}

const pdfToDocs = async (file: File) => {
  // Read the file as a buffer
  const buffer = await file.arrayBuffer();
  // Create a Blob from the buffer
  const nike10kPDFBlob = new Blob([buffer], { type: "application/pdf" });
  const loader = new WebPDFLoader(nike10kPDFBlob, {});
  return await loader.load();
};
const splitDocs = async (docs: any) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 0,
  });
  return await splitter.splitText(docs.pageContent);
};

const uploadToDb = async (chunks: string[]) => {
  const model = "multilingual-e5-large";
  const embeddings: any = await pc.inference.embed(model, chunks, {
    inputType: "passage",
    truncate: "END",
  });
  const vectors = chunks.map((d, i) => ({
    id: Md5.hashStr(d),
    values: embeddings.data[i].values,
    metadata: { text: d },
  }));
  const index = pc.index("chatbot");
  await index.upsert(vectors);
};

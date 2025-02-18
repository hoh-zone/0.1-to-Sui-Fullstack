import { NextRequest, NextResponse } from "next/server";

// 上传到 Walrus
export const uploadToWalrus = async (file: File): Promise<string> => {
  const response = await fetch(
    `https://publisher.walrus-testnet.walrus.space/v1/blobs?epochs=1`,
    {
      method: "PUT",
      body: file,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload to Walrus");
  }

  const info = await response.json();
  const blobId = info.newlyCreated.blobObject.blobId;

  return `https://aggregator.walrus-testnet.walrus.space/v1/blobs/${blobId}`;
};

export async function POST(req: NextRequest) {
  try {
    // 检查请求类型
    const contentType = req.headers.get("content-type") || "";
    
    let file: File;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const uploadedFile = formData.get("file") as File;
      
      if (!uploadedFile) {
        return NextResponse.json(
          { error: "File is required" },
          { status: 400 }
        );
      }
      file = uploadedFile;
    } else {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 }
      );
    }

    // 验证文件类型
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPG and PNG are allowed" },
        { status: 400 }
      );
    }

    // 验证文件大小 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }
    console.log(file)

    const walrusUrl = await uploadToWalrus(file);

    return NextResponse.json({ url: walrusUrl }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}

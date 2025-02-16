import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const req = await request.formData()
        // console.log('req = ', req)
        const formData = new FormData()
        formData.append('files', req.get('file') as File)

        const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/upload`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_CMS_TOKEN}`
            },
            body: formData
        })
        const data = await res.json()
        console.log('upload data = ', data)
        if (data.error) {
            return NextResponse.json({ error: data.error.message }, { status: data.error.status })
        }
        return NextResponse.json({ message: "ok", data }, { status: 200 })
    } catch (error) {
        console.error("上传文件失败:", error)
        return NextResponse.json({ error: "上传文件失败" }, { status: 500 })
    }
}

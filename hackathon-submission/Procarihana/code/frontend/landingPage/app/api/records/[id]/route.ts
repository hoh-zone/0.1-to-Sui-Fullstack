import { NextResponse } from "next/server";

export async function PUT(request: Request) {
    try {
        const url = new URL(request.url)
        const path = url.pathname
        const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/records/${path}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_CMS_TOKEN}`
            },
            body: request.body
        })
        const data = await res.json()
        return NextResponse.json({ message: "ok", data }, { status: 200 })
    } catch (error) {
        console.error("更新回访记录失败:", error)
        return NextResponse.json({ error: "更新回访记录失败" }, { status: 500 })
    }
}


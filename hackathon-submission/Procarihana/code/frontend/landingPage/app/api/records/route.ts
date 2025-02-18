import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const query = request.url.split('?')[1];
        const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/records?${query}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_CMS_TOKEN}`
            }
        })
        const data = await res.json()
        if (data.error) {
            return NextResponse.json({ error: data.error.message }, { status: data.error.status })
        }
        return NextResponse.json({ message: "ok", data }, { status: 200 })
    } catch (error) {
        console.error("查询回访记录失败:", error)
        return NextResponse.json({ error: "查询回访记录失败" }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const url = new URL(request.url)
        const req = await request.json()
        const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/records/${url.searchParams.get("id")}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_CMS_TOKEN}`
            },
            body: JSON.stringify(req)
        })
        const data = await res.json()
        if (data.error) {
            return NextResponse.json({ error: data.error.message }, { status: data.error.status })
        }
        
        return NextResponse.json({ message: "ok", data }, { status: 200 })
    } catch (error) {
        console.error("更新回访记录失败:", error)
        return NextResponse.json({ error: "更新回访记录失败" }, { status: 500 })
    }
}


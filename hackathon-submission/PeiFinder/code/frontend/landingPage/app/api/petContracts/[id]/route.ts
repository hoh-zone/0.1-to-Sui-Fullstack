import { NextResponse } from "next/server";
import { join } from "path";
import { writeFile } from "fs/promises";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function PUT(request: Request) {
    try {
        const url = new URL(request.url)
        const req = await request.json()
        console.log('更新合同请求体：', req)
        console.log('id = ', url.searchParams.get('id'))
        const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/pet-contracts/${url.searchParams.get('id')}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_CMS_TOKEN}`
            },
            body: JSON.stringify(req)
        })
        const data = await res.json()
        console.log('更新合同：', data)
        if (data.error) {
            throw new Error(data.error.message)
        }
        return NextResponse.json({ message: "ok", data }, { status: 200 })
    } catch (error) {
        console.error("更新合同失败:", error)
        return NextResponse.json({ error: "更新合同失败" }, { status: 500 })
    }
}
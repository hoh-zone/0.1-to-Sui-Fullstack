import { NextResponse } from "next/server";
import { join } from "path";
import { writeFile } from "fs/promises";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: Request) {
    try {
        const query = request.url.split('?')[1];
        const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/pet-contracts?${query}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_CMS_TOKEN}`
            }
        })
        const data = await res.json()
        return NextResponse.json({ message: "ok", data }, { status: 200 })
    } catch (error) {
        console.error("查询合同失败:", error)
        return NextResponse.json({ error: "查询合同失败" }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const url = new URL(request.url)
        const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/pet-contracts/${url.pathname}`, {
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
        console.error("更新合同失败:", error)
        return NextResponse.json({ error: "更新合同失败" }, { status: 500 })
    }
}
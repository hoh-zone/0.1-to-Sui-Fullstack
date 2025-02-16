import { NextResponse } from "next/server";
import { join } from "path";
import { writeFile } from "fs/promises";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const req = await request.json()
        // console.log('post body = ', req)
        const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/pet-applies`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_CMS_TOKEN}`
            },
            body: JSON.stringify(req)
        })
        
        const newApply = await res.json()
        // console.log('newApply = ', newApply)
        if (newApply.error) {
            return NextResponse.json({ error: newApply.error.message }, { status: newApply.error.status })
        }

        return NextResponse.json({ message: "ok", data: newApply.data }, { status: 200 })
    } catch (error) {
        console.error("提交申请失败:", error)
        return NextResponse.json({ error: "提交申请失败" }, { status: 500 })
    }
}

export async function GET(request: Request) {
    try {
        const query = request.url.split('?')[1];
        const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/pet-applies?${query}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_CMS_TOKEN}`
            }
        })
        const data = await res.json()
        return NextResponse.json({ message: "ok", data }, { status: 200 })
    } catch (error) {
        console.error("查询申请失败:", error)
        return NextResponse.json({ error: "查询申请失败" }, { status: 500 })
    }
}

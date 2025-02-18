import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = await prisma.token.create({
      data: {
        name: body.name,
        symbol: body.symbol,
        description: body.description,
        iconUrl: body.icon_url,
        packageId: body.packageId,
        treasuryCap: body.treasuryCap,
        metadata: body.metadata,
      },
    });

    return NextResponse.json(token);
  } catch (error) {
    console.error("Error creating token:", error);
    return NextResponse.json(
      { error: "Failed to create token" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import { PromptTemplate } from "@langchain/core/prompts";
import { MODEL } from "../../_constant";
import { generateImg } from "./imgTool";

export const runtime = "edge";

const TEMPLATE = `As a meme token generator, create a fun and engaging token based on the following description:

{input}

Requirements:
- Name should be short, catchy, and relevant (2-20 characters)
- Symbol should be 2-6 letters
- Description should be fun and engaging (50-200 characters)
- Icon prompt should be detailed and specific for generating a unique logo

Important: 
- Do not use any special characters (like @, #, $, %, ", etc.) in the name or symbol
- Do not wrap any content in quotes
- Name should NOT contain words like "meme", "coin", or "token"

Please generate token information according to these requirements.`;

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const currentMessageContent = body.question ?? "";

		const prompt = PromptTemplate.fromTemplate(TEMPLATE);

		const schema = z
			.object({
				name: z
					.string()
					.min(2)
					.max(20)
					.describe(
						"Token name: short, catchy, and relevant to the description",
					),
				symbol: z.string().min(2).max(7).describe("Token symbol: 2-6 letters"),
				description: z
					.string()
					.min(50)
					.max(200)
					.describe(
						"Token description: concise and fun, highlighting unique features",
					),
				icon_url: z
					.string()
					.describe(
						"Detailed icon prompt for generating the token logo (in English)",
					),
			})
			.describe("Meme token information generator");

		const functionCallingModel = MODEL.withStructuredOutput(schema, {
			name: "output_formatter",
		});

		const chain = prompt.pipe(functionCallingModel);

		const result = await chain.invoke({
			input: currentMessageContent,
		});

		const url = await generateImg(result.icon_url);

		result.icon_url = url;

		return NextResponse.json(result, { status: 200 });
	} catch (e) {
		if (e instanceof Error) {
			const status =
				"status" in e ? (e as { status: number }).status : 500;
			return NextResponse.json({ error: e.message }, { status });
		}
		return NextResponse.json(
			{ error: "An unknown error occurred" },
			{ status: 500 },
		);
	}
}

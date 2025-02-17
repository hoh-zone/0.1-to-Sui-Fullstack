import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

export const MODEL = new ChatGoogleGenerativeAI({
	temperature: 0.8,
	model: "gemini-1.5-flash",
	baseUrl: "https://gemini-proxy.keyikai.me",
});

 
export const client = new SuiClient({ url: getFullnodeUrl('testnet') });

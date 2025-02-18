import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
import HttpsProxyAgent from 'https-proxy-agent';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // calvin
  // baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  baseURL: 'https://openrouter.ai/api/v1/',
  httpAgent: process.env.PROXY_URL ? new HttpsProxyAgent.HttpsProxyAgent(process.env.PROXY_URL as string) : undefined,
});

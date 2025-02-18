import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";
import { MODEL } from "../../_constant";
import googleTrends from 'google-trends-api';
import { TwitterApi } from 'twitter-api-v2';

export const runtime = "edge";

const TEMPLATE = `As a meme token generator, create a fun and engaging token based on the following trending topic:

{input}

Requirements:
- Name should be short, catchy, and relevant (2-20 characters)
- Symbol should be 2-6 letters
- Description should be fun and engaging (50-200 characters)
- Include the trending context in a creative way

Important: 
- Do not use any special characters in the name or symbol
- Make it relatable to the current trend

Please generate token information according to these requirements.`;

async function getGoogleTrends() {
    try {
        const result = await googleTrends.dailyTrends({
            geo: 'US',
        });
        const data = JSON.parse(result);
        const trends = data.default.trendingSearchesDays[0].trendingSearches
            .slice(0, 5)
            .map((trend: any) => trend.title.query);
        return trends;
    } catch (error) {
        console.error('Error fetching Google trends:', error);
        return [];
    }
}

async function getTwitterTrends() {
    try {
        const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN || '');
        const v2Client = client.v2;
        
        // Get trends for US (WOEID: 23424977)
        const { data } = await v2Client.trendingHashtags();
        return data.slice(0, 5).map(trend => trend.name);
    } catch (error) {
        console.error('Error fetching Twitter trends:', error);
        return [];
    }
}

async function getTrendingTopics() {
    const [googleTrends, twitterTrends] = await Promise.all([
        getGoogleTrends(),
        getTwitterTrends()
    ]);
    
    const allTrends = [...googleTrends, ...twitterTrends];
    return allTrends.length > 0 ? allTrends : [];
}

export async function GET(req: NextRequest) {
    try {
        const trends = await getTrendingTopics();
        if (!trends.length) {
            throw new Error('No trending topics found');
        }

        const randomTrend = trends[Math.floor(Math.random() * trends.length)];

        const prompt = PromptTemplate.fromTemplate(TEMPLATE);

        const schema = z.object({
            name: z.string().min(2).max(20)
                .describe('Token name: short, catchy, and relevant to the trending topic'),
            symbol: z.string().min(2).max(7)
                .describe('Token symbol: 2-6 letters'),
            description: z.string().min(50).max(200)
                .describe('Token description: fun and trendy, incorporating the current topic'),
            trend: z.string()
                .describe('The trending topic that inspired this token'),
        }).describe('Trend-based meme token information');

        const functionCallingModel = MODEL.withStructuredOutput(schema, {
            name: 'output_formatter',
        });

        const chain = prompt.pipe(functionCallingModel);

        const result = await chain.invoke({
            input: randomTrend,
        });

        return NextResponse.json({
            ...result,
            trend: randomTrend,
        }, { status: 200 });
    } catch (e) {
        if (e instanceof Error) {
            const status = 'status' in e ? (e as { status: number }).status : 500;
            return NextResponse.json({ error: e.message }, { status });
        }
        return NextResponse.json(
            { error: 'An unknown error occurred' },
            { status: 500 },
        );
    }
}

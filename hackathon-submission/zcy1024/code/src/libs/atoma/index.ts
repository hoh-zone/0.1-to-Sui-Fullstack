'use server'

// import {AtomaSDK} from "atoma-sdk";

// export async function run() {
//     // console.log(process.env.ATOMA_KEY, process.env.ATOMA_MODEL);
//     const atomaSDK = new AtomaSDK({
//         bearerAuth: process.env.ATOMA_KEY
//     });
//     const result = await atomaSDK.chat.create({
//         messages: [
//             {
//                 role: "user",
//                 content: "Hello!"
//             }
//         ],
//         model: process.env.ATOMA_MODEL!
//     });
//     console.log(result);
// }

import axios from "axios";

type ResponseType = {
    choices: {
        message: {
            content: string
        }
    }[],
}

type ElizaType = {
    text: string
}[]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function run_eliza(historicalData: string) {
    const res = await axios.post("https://3344-elizaos-eliza-0w4rsg6hhb5.ws-us117.gitpod.io/5d16ca26-9f97-0e17-b17e-b83f5dee6163/message", JSON.stringify({
        user: "user",
        text: historicalData
    }), {
        headers: {
            "Content-Type": "application/json",
        },
        // timeout: 5000,
        maxBodyLength: 50000,
        maxContentLength: 50000
    });
    return (res.data as ElizaType)[0].text.split(' ');
}

const developerContent =
`You can only choose from [0, 1, 2].
Please predict the least likely and most likely numbers to choose in next time, the two numbers cannot be the same, separate them with spaces and output them, no specific analysis and thinking process is required.`;

async function run_axios(historicalData: string) {
    const res = await axios.post("https://api.atoma.network/v1/chat/completions", JSON.stringify({
        model: process.env.ATOMA_MODEL,
        messages: [
            {
                role: "developer",
                content: developerContent
            },
            {
                role: "user",
                content: historicalData
            }],
    }), {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.ATOMA_KEY}`
        },
        timeout: 5000,
        maxBodyLength: 50000,
        maxContentLength: 50000
    });
    return (res.data as ResponseType).choices[0].message.content.split(' ');
}

export async function run(historicalData: string)  {
    try {
        return await run_axios(historicalData);
    } catch (err) {
        console.log(err);
        return ['6', '6']
    }
    // const res = await fetch("https://api.atoma.network/v1/chat/completions", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": `Bearer ${process.env.ATOMA_KEY}`
    //     },
    //     body: JSON.stringify({
    //         model: process.env.ATOMA_MODEL,
    //         messages: [
    //             {
    //                 role: "developer",
    //                 content: developerContent
    //             },
    //             {
    //                 role: "user",
    //                 content: historicalData
    //             }],
    //     })
    // });
    // return res.json();
}
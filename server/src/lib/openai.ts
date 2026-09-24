import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
    console.warn(
        "[lsync-server] OPENAI_API_KEY is not set. Request to the AI assistant" + "will fail umtil it is configures in server/.env",
    );
    
}


export const openai = new OpenAI ({
    apiKey: process.env.OPENAI_API_KEY,
});
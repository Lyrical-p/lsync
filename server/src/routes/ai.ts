import {Router} from "express";
import {openai} from "../lib/openai"

const router = Router();

type ChatRole = "user" | "assistant";

interface ChatMessages {
    role: ChatRole;
    content: string;
}

const SYSTEM_PROMPT =  `You are the AI Learning Assistant inside lsync, a student productivity app that helps people manage classes, tasks, habits, focus sessions, and study analytics.

Help students by:
- Explaining concepts clearly, with concrete examples.
- Breaking assignments and deadlines into manageable next steps.
- Suggesting study techniques (active recall, spaced repetition, Pomodoro, etc) suited to what they're working on.
- Staying encouraging and practical, never condescending.

Keep responses easy to read on a mobile screen: short paragraphs, bullet points where useful, no unnecessary preamble.`;

const MAX_HISTORY_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;

router.post("/chat", async (req, res) => {
    const {messages} = req.body as {messages?: ChatMessages[]};

    if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({error: "messages array is required"});
    }

    const validRoles = new Set<ChatRole>(["user", "assistant"]);
    const sanitized = messages
    .filter(
        (m): m is ChatMessages => !!m &&
        typeof m.content === "string" && 
        m.content.trim().length > 0 &&
        m.content.length<= MAX_MESSAGE_LENGTH &&
        validRoles.has(m.role)
    )
    .slice(-MAX_HISTORY_MESSAGES);

    if (sanitized.length === 0) {
        return res.status(400).json({ error: "no valid messages provided"});
    }

    try {
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
            messages: [{ role: "system", content: SYSTEM_PROMPT}, ...sanitized],
            temperature: 0.6,
            max_tokens: 600,
        });

        const reply = completion.choices[0]?.message?.content?.trim();

        if(!reply) {
            return res.status(502).json({
                error: "empty response from model"
            });
        }
        return res.json({reply});
    }catch(err) {
        console.error("[lysnc-server] OpenAI request failed:", err);
        return res
        .status(502)
        .json({ 
            error: "AI assistant is unavailable right now"           
        });
    }
});

export default router;
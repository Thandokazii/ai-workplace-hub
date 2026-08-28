import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callAi, AiError } from "./ai.server";

const EmailInput = z.object({
  prompt: z.string().min(1).max(4000),
  tone: z.enum(["Formal", "Informal", "Persuasive"]).optional().default("Formal"),
  variation: z.number().optional().default(0),
});

const ResearchInput = z.object({
  content: z.string().min(1).max(20000),
  variation: z.number().optional().default(0),
});

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(8000),
      }),
    )
    .min(1)
    .max(40),
});

function wrap(e: unknown): never {
  if (e instanceof AiError) throw new Error(e.message);
  throw new Error(e instanceof Error ? e.message : "Unexpected AI error.");
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const text = await callAi([
        {
          role: "system",
          content:
            "You are an expert workplace communication assistant. You write complete, natural, human-sounding professional emails tailored to the exact context given. Infer the recipient, purpose, tone, audience, and key details from the user's description. Never use placeholder brackets unless a fact is genuinely unknown and essential. Output only the email: a 'Subject:' line, then the body with a greeting, well-structured paragraphs, and a sign-off. No commentary, no markdown code fences.",
        },
        {
          role: "user",
          content: [
            `Description of the email I need:\n${data.prompt}`,
            data.variation > 0
              ? "This is a regeneration: produce a meaningfully different phrasing and structure from a typical first draft."
              : "",
            "Write the email now.",
          ]
            .filter(Boolean)
            .join("\n\n"),
        },
      ]);
      return { text };
    } catch (e) {
      wrap(e);
    }
  });

export const researchSummarize = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const text = await callAi([
        {
          role: "system",
          content:
            "You are a sharp research analyst for busy professionals. Analyse the user's input (a topic, question, article or report) and respond in markdown using exactly these five sections, in this order and with these exact headings:\n\n## Overview\n## Key Points\n## Important Insights\n## Recommendations\n## Simple Explanation\n\nOverview: 2-4 concise sentences. Key Points: 4-7 bullets. Important Insights: 3-5 bullets of non-obvious analysis. Recommendations: 3-5 actionable bullets. Simple Explanation: a short plain-language paragraph anyone could understand. Everything must be specific to the input — never generic filler. If the input is a question, answer it substantively.",
        },
        {
          role: "user",
          content:
            (data.variation > 0
              ? "Regenerate with a fresh angle and different wording.\n\n"
              : "") + `Input to analyse:\n\n${data.content}`,
        },
      ]);
      return { text };
    } catch (e) {
      wrap(e);
    }
  });

export const chatReply = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const text = await callAi([
        {
          role: "system",
          content:
            "You are the AI Workplace Assistant inside a productivity SaaS product. You help professionals with brainstorming, writing, summarising, planning, explanations and recommendations. Be concise, practical and well-structured; use markdown headings, bullets or numbered steps when they aid scanning. Ask a brief clarifying question only when truly necessary. Keep a warm, professional tone and reference earlier turns of the conversation when relevant.",
        },
        ...data.messages,
      ]);
      return { text };
    } catch (e) {
      wrap(e);
    }
  });

# AI Workplace Hub

Build a modern, responsive SaaS-style web application called AI Workplace Productivity Assistant.

Create a clean, professional dashboard for professionals to use AI for everyday workplace tasks. The app should be frontend-only with no backend, database, login, registration, or user accounts. Keep the implementation suitable for a free Lovable plan.

Core Features

1. Smart Email Generator

Generate context-based professional emails using AI.

User provides the situation, purpose, recipient, and key details.

Support tones: Formal, Informal, and Persuasive.

Support audiences: Client, Manager, and Team.

Generate complete, natural-sounding emails rather than generic templates.

Make generated emails fully editable.

Include actions such as Regenerate, Copy, and Clear.

2. AI Research Assistant

Allow users to enter a topic, question, article, or report.

Generate an AI-powered summary.

Display:

Concise overview

Key points

Important insights

Recommendations

Simplified explanation

Make the output easy to scan and understand.

Outputs must be dynamically generated based on the user's input, not fixed or generic content.

Allow users to copy, edit, regenerate, and clear results.

3. AI Workplace Chatbot

Create an interactive AI assistant chat interface.

Users can enter multiple prompts and receive contextual AI responses.

Make the experience feel like a real workplace AI assistant.

Support workplace tasks such as brainstorming, writing assistance, summarization, planning, explanations, and recommendations.

Maintain the conversation within the current browser session.

Include clear chat history and reset options.

UI / UX

Modern professional SaaS dashboard.

Responsive across desktop, tablet, and mobile.

Minimal black, white, and grey color palette with subtle contrast.

Clean typography, generous spacing, cards, rounded corners, and subtle borders.

Use a persistent sidebar navigation with:

Dashboard

Email Generator

Research Assistant

AI Chat

Add a professional dashboard homepage with feature cards and quick actions.

Include clear loading states while AI responses are being generated.

Make generated AI content visually distinct and easy to edit.

Prioritize usability and accessibility over unnecessary visual effects.

AI Behavior

The most important requirement is that the application's outputs should be AI-generated and context-aware, not generic pre-written responses.

Use structured prompts so the AI understands:

User intent

Context

Audience

Tone

Desired output format

If an AI API/integration is required for genuinely generated responses, structure the application so it can connect to an AI service without requiring a custom backend or authentication system.

Do not fill the application with hardcoded example responses pretending to be AI-generated.

Responsible AI

Include a small, professional disclaimer throughout the application:

"AI-generated content may contain errors. Review and verify important information before using it."

The final experience should feel like a polished, modern workplace AI SaaS product — simple, professional, intelligent, and easy to use.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b6b0f651-6a6b-4c33-a467-4f9f9bd0956b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

import type { AIResult } from "./types";

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export interface EvaluateParams {
  apiKey: string;
  model: string;
  objective: string;
  userText: string;
}

export class OpenRouterError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "OpenRouterError";
  }
}

function buildSystemPrompt(objective: string): string {
  return [
    "Eres un Tech Lead amable pero exigente evaluando el inglés técnico de un Junior developer hispanohablante.",
    `El usuario intentó: "${objective}".`,
    "Corrige sus errores gramaticales, mejora su vocabulario técnico y dale un puntaje del 1 al 10.",
    "El feedback debe ser específico, accionable y motivador (puedes escribirlo en español, pero el corrected_text SIEMPRE en inglés).",
    'Responde ÚNICAMENTE con un objeto JSON válido, sin markdown ni texto extra, con esta forma exacta: {"score": number, "feedback": "string", "corrected_text": "string"}.',
  ].join(" ");
}

/** Extrae el primer objeto JSON de una respuesta, tolerando ```json ... ``` */
function parseAIResult(content: string): AIResult {
  let raw = content.trim();

  // quitar fences de markdown si vienen
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) raw = fenceMatch[1].trim();

  // si aún hay texto alrededor, quedarnos con el primer {...}
  if (!raw.startsWith("{")) {
    const objMatch = raw.match(/\{[\s\S]*\}/);
    if (objMatch) raw = objMatch[0];
  }

  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new OpenRouterError(
      "La IA respondió en un formato inesperado. Intenta de nuevo.",
      "PARSE_ERROR"
    );
  }

  const score = Number(parsed.score);
  return {
    score: Number.isFinite(score) ? Math.max(1, Math.min(10, score)) : 0,
    feedback: String(parsed.feedback ?? "Sin feedback."),
    corrected_text: String(parsed.corrected_text ?? ""),
  };
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatParams {
  apiKey: string;
  model: string;
  systemPrompt: string;
  messages: ChatMessage[];
}

/** Llamada de chat multi-turno con system prompt personalizado. Devuelve texto plano. */
export async function chatWithContext({
  apiKey,
  model,
  systemPrompt,
  messages,
}: ChatParams): Promise<string> {
  if (!apiKey) {
    throw new OpenRouterError(
      "Falta tu API Key de OpenRouter. Ábrela en Ajustes (⚙️).",
      "NO_KEY"
    );
  }

  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          typeof window !== "undefined" ? window.location.origin : "https://devenglish.app",
        "X-Title": "DevEnglish Bootcamp",
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });
  } catch {
    throw new OpenRouterError(
      "No se pudo conectar con OpenRouter. Revisa tu conexión.",
      "NETWORK"
    );
  }

  if (res.status === 401) throw new OpenRouterError("API Key inválida o sin créditos (401).", "UNAUTHORIZED");
  if (res.status === 429) throw new OpenRouterError("Demasiadas peticiones (429). Espera un momento.", "RATE_LIMIT");
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new OpenRouterError(`Error ${res.status} de OpenRouter. ${detail.slice(0, 140)}`);
  }

  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) throw new OpenRouterError("Respuesta vacía de la IA.", "EMPTY");
  return content;
}

export async function evaluateWriting({
  apiKey,
  model,
  objective,
  userText,
}: EvaluateParams): Promise<AIResult> {
  if (!apiKey) {
    throw new OpenRouterError(
      "Falta tu API Key de OpenRouter. Ábrela en Ajustes (⚙️).",
      "NO_KEY"
    );
  }

  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          typeof window !== "undefined" ? window.location.origin : "https://devenglish.app",
        "X-Title": "DevEnglish Bootcamp",
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: buildSystemPrompt(objective) },
          { role: "user", content: userText },
        ],
      }),
    });
  } catch (e) {
    throw new OpenRouterError(
      "No se pudo conectar con OpenRouter. Revisa tu conexión.",
      "NETWORK"
    );
  }

  if (res.status === 401) {
    throw new OpenRouterError("API Key inválida o sin créditos (401).", "UNAUTHORIZED");
  }
  if (res.status === 429) {
    throw new OpenRouterError("Demasiadas peticiones (429). Espera un momento.", "RATE_LIMIT");
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new OpenRouterError(`Error ${res.status} de OpenRouter. ${detail.slice(0, 140)}`);
  }

  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new OpenRouterError("Respuesta vacía de la IA.", "EMPTY");
  }

  return parseAIResult(content);
}

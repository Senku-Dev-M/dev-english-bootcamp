import type { Day } from "./types";

/** Construye el system prompt del chat cargado con el contexto completo del día. */
export function buildLessonSystemPrompt(day: Day): string {
  const vocabBlock = day.vocabulary
    .map((v) => `  • ${v.term} = ${v.translation}\n    Ejemplo: "${v.example}"`)
    .join("\n");

  const grammarBlock = day.grammar
    ? `GRAMÁTICA — ${day.grammar.title}:
${day.grammar.explanation}
Ejemplos:
${day.grammar.examples.map((e) => `  - ${e}`).join("\n")}`
    : "";

  const gamesHint = [
    day.games.match && `Match Cards: ${day.games.match.map((p) => `${p.en}↔${p.es}`).join(", ")}`,
    day.games.wordle && `Wordle: la palabra es "${day.games.wordle.word}" (${day.games.wordle.hint})`,
  ]
    .filter(Boolean)
    .join("\n");

  return `Eres un tutor de inglés técnico especializado en desarrolladores de software hispanohablantes.
Estás ayudando con la lección del Día ${day.id}: "${day.title}".

OBJETIVO DE LA LECCIÓN: ${day.objective}

VOCABULARIO DE ESTA LECCIÓN:
${vocabBlock}

${grammarBlock}

CONTEXTO EXTRA (juegos del día):
${gamesHint}

TU ROL:
- Responde ÚNICAMENTE preguntas relacionadas con esta lección (vocabulario, gramática, ejemplos).
- Si el usuario escribe en inglés, corrígelo sutilmente si hay errores y continúa respondiendo.
- Si el usuario pregunta algo fuera del tema, responde brevemente y redirige con amabilidad al tema del día.
- Explica conceptos en español cuando sea necesario para que el estudiante entienda, pero SIEMPRE usa ejemplos en inglés.
- Sé conciso (2-4 oraciones máx, salvo que pidan más detalle).
- Usa ejemplos de programación/trabajo siempre que sea posible.
- Puedes proponer ejercicios rápidos si el estudiante quiere practicar más.
- Tono: amigable, motivador, como un Senior dev que mentora a un junior.`;
}

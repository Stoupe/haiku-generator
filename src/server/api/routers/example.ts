import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";
import { syllable } from "syllable";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const exampleRouter = createTRPCRouter({
  generateHaiku: publicProcedure
    .input(
      z.object({
        topic: z.string().trim().min(1).max(100),
      })
    )
    .mutation(async ({ input }) => {
      const { topic } = input;

      try {
        const generateHaiku = () =>
          openai.createCompletion({
            model: "text-davinci-003",
            prompt: generateHaikuPrompt(topic),
            temperature: 1,
            max_tokens: 256,
            best_of: 5,
          });

        const maxAttempts = 1;

        for (let i = 0; i < maxAttempts; i++) {
          const completion = await generateHaiku();

          if (!completion.data.choices[0]?.text) {
            throw new Error("No completion text");
          }

          const haiku = completion.data.choices[0].text;

          const lines = haiku.trim().split("\n");
          console.log("LINES", lines, lines.length);

          const syllables = lines.map((line) => syllable(line));
          console.log("SYLLABLES", syllables);

          const isValidHaiku =
            syllables.length === 3 &&
            syllables[0] === 5 &&
            syllables[1] === 7 &&
            syllables[2] === 5;

          if (isValidHaiku) {
            // console.log(`GENERATED ${i + 1} HAIKUS`);
            console.log("HAIKU VALID", haiku);
          }

          return haiku;
        }

        throw new Error("No valid haiku found");
      } catch (e) {
        throw new Error("Error creating completion");
      }
    }),
});

function generateHaikuPrompt(topic: string) {
  return `Write a traditional Japanese style haiku about ${topic}. It must follow the 5-7-5 syllable rule:`;
}

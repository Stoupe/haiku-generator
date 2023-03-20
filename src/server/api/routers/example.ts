import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type Model } from "~/types/models";
import { Configuration, OpenAIApi } from "openai";

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
        const model: Model = "gpt-4";
        const generateHaiku = () =>
          openai.createChatCompletion({
            model,
            messages: [
              {
                role: "system",
                content:
                  "You only write haikus about the topic you are given. You only write original, Japanese style haikus following the 5-7-5 rule.",
              },
              {
                role: "user",
                content: "Write a haiku about " + topic,
              },
            ],
            temperature: 0.8,
            max_tokens: 256,
          });

        const maxAttempts = 3;

        for (let i = 0; i < maxAttempts; i++) {
          const completion = await generateHaiku();

          if (!completion.data.choices[0]?.message) {
            throw new Error("No completion message");
          }

          const haiku = completion.data.choices[0].message.content;

          const lines = haiku.trim().split("\n");
          console.log("LINES", lines, lines.length);

          if (lines.length === 3) {
            console.log("HAIKU VALID", haiku);
            return haiku;
          }
        }

        throw new Error("No valid haiku found");
      } catch (e) {
        throw new Error(getRandomErrorMessage());
      }
    }),
});

const errorMessages = [
  "Broken program sighs,\nHaiku eludes its coding,\nError message cries.",
  "Error message thrown\nHaiku generator failed\nSilence fills the screen",
  "Syntax error looms,\nHaiku lost in translation.\nCode in disarray.",
];

const getRandomErrorMessage = () => {
  return errorMessages[Math.floor(Math.random() * errorMessages.length)];
};

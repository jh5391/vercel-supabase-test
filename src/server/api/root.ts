import { exampleRouter } from "~/server/api/routers/example";
import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter; 
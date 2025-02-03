import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import { type AppRouter } from "~/server/api/root";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // 브라우저에서는 상대 URL 사용
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR 시 Vercel 배포 URL
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR
};

/** tRPC 클라이언트 설정 */
export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
});

/**
 * tRPC 라우터의 입력/출력 타입 추론 유틸리티
 */
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>; 
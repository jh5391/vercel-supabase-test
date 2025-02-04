import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

// 로그 유틸리티 함수
const logAccess = (action: string, data?: any) => {
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    action,
    data,
    service: 'user-service',
  };
  
  // 개발 환경에서는 콘솔에 출력
  if (process.env.NODE_ENV === 'development') {
    console.log('Access Log:', JSON.stringify(logData, null, 2));
  }
  
  return logData;
};

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    // 요청 로깅
    logAccess('getAll:request');
    
    try {
      const users = await prisma.user.findMany();
      // 성공 로깅
      logAccess('getAll:success', { count: users.length });
      return users;
    } catch (error) {
      // 에러 로깅
      logAccess('getAll:error', { error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }),
  
  create: publicProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
    }))
    .mutation(async ({ input }) => {
      // 요청 로깅
      logAccess('create:request', { input });
      
      try {
        const user = await prisma.user.create({
          data: input,
        });
        // 성공 로깅
        logAccess('create:success', { userId: user.id });
        return user;
      } catch (error) {
        // 에러 로깅
        logAccess('create:error', { 
          error: error instanceof Error ? error.message : 'Unknown error',
          input 
        });
        throw error;
      }
    }),
}); 
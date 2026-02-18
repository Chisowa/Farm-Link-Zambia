import { publicProcedure, router } from "../trpc";
import { healthCheckSchema } from "../schemas";

export const healthRouter = router({
  check: publicProcedure.query(async (): Promise<typeof healthCheckSchema._type> => {
    return {
      status: "ok",
      timestamp: new Date(),
    };
  }),
});

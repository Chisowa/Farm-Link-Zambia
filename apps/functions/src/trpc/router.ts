import { router } from './trpc'
import { userRouter } from './routers/user'
import { cropsRouter } from './routers/crops'
import { adviceRouter } from './routers/advice'
import { weatherRouter } from './routers/weather'
import { pestsRouter } from './routers/pests'
import { diseasesRouter } from './routers/diseases'

export const appRouter = router({
  user: userRouter,
  crops: cropsRouter,
  advice: adviceRouter,
  weather: weatherRouter,
  pests: pestsRouter,
  diseases: diseasesRouter,
})

export type AppRouter = typeof appRouter

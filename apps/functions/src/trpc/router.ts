import { router } from './trpc.js'
import { userRouter } from './routers/user.js'
import { cropsRouter } from './routers/crops.js'
import { adviceRouter } from './routers/advice.js'
import { weatherRouter } from './routers/weather.js'
import { pestsRouter } from './routers/pests.js'
import { diseasesRouter } from './routers/diseases.js'

export const appRouter = router({
  user: userRouter,
  crops: cropsRouter,
  advice: adviceRouter,
  weather: weatherRouter,
  pests: pestsRouter,
  diseases: diseasesRouter,
})

export type AppRouter = typeof appRouter

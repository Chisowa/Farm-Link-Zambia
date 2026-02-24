import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@repo/functions/router'
import { env } from '../env'

export const trpc = createTRPCReact<AppRouter>()

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${env.VITE_TRPC_API_URL}/trpc`,
    }),
  ],
})

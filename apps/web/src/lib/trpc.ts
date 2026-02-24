import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@repo/functions/router'

export const trpc = createTRPCReact<AppRouter>()

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      // Production: set VITE_TRPC_URL=https://farmlink-zambia.web.app/api/trpc
      // Emulator:   http://localhost:5001/farmlink-zambia/us-central1/api/trpc
      url:
        import.meta.env.VITE_TRPC_URL ||
        import.meta.env.VITE_API_URL ||
        'http://localhost:5001/farmlink-zambia/us-central1/api/trpc',
    }),
  ],
})

import { TRPCError, initTRPC } from '@trpc/server'
import type { Request } from 'express'
import { getAuth } from 'firebase-admin/auth'

export interface Context {
  uid: string | null
}

/** Called once per request — extracts the Firebase ID token from the Authorization header. */
export async function createContext({ req }: { req: Request }): Promise<Context> {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return { uid: null }
  try {
    const token = authHeader.split(' ')[1]
    const decoded = await getAuth().verifyIdToken(token)
    return { uid: decoded.uid }
  } catch {
    return { uid: null }
  }
}

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

/** Requires a verified Firebase ID token — throws UNAUTHORIZED otherwise. */
export const authedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.uid) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' })
  return next({ ctx: { ...ctx, uid: ctx.uid } })
})

export const createCallerFactory = t.createCallerFactory

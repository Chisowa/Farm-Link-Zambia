import { trpc } from '../lib/trpc'

/** Hook to ask the RAG-powered AI advisor a question. */
export function useAskAI() {
  return trpc.advice.askAI.useMutation()
}

/** Hook to load the authenticated user's advice history from Firestore.
 *  Pass `enabled=true` only once Firebase Auth has confirmed a user is logged in,
 *  otherwise the request fires before the ID token is available and gets UNAUTHORIZED. */
export function useAdviceHistory(enabled = false) {
  return trpc.advice.getAdviceHistory.useQuery(undefined, { enabled, retry: false })
}

/** Hook to submit thumbs-up/down feedback on a piece of advice. */
export function useSubmitFeedback() {
  return trpc.advice.submitFeedback.useMutation()
}

/** Hook to delete all advice history for the authenticated user. */
export function useClearHistory() {
  return trpc.advice.clearHistory.useMutation()
}

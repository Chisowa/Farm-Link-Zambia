import { trpc } from '../lib/trpc'

/**
 * Hook to ask the RAG-powered AI advisor a question.
 *
 * Usage:
 *   const { mutate, isPending, data, error } = useAskAI()
 *   mutate({ query: "How do I treat armyworm on my maize?", userId: user.uid })
 */
export function useAskAI() {
  return trpc.advice.askAI.useMutation()
}

/**
 * Hook to load the user's advice history from Firestore.
 */
export function useAdviceHistory(userId: string) {
  return trpc.advice.getAdviceHistory.useQuery({ userId }, { enabled: !!userId })
}

/**
 * Hook to submit thumbs-up/down feedback on a piece of advice.
 */
export function useSubmitFeedback() {
  return trpc.advice.submitFeedback.useMutation()
}

/**
 * Hook to delete all advice history for a user.
 */
export function useClearHistory() {
  return trpc.advice.clearHistory.useMutation()
}

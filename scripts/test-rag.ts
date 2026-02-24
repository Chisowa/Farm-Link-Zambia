/**
 * Farm-Link Zambia — Interactive RAG Test CLI
 * ============================================
 * Run from repo root:
 *   npx tsx scripts/test-rag.ts
 */

import * as readline from 'readline'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load env BEFORE importing RAG modules (they read process.env at init time)
dotenv.config({ path: path.resolve(process.cwd(), 'apps/functions/.env') })

const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const CYAN = '\x1b[36m'
const GREY = '\x1b[90m'
const RESET = '\x1b[0m'
const BOLD = '\x1b[1m'

async function main() {
  // Dynamic import AFTER dotenv.config() so env vars are available at module init
  const { askRag } = await import('../apps/functions/src/rag/ragEngine.js')

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

  console.log(`\n${BOLD}${GREEN}╔══════════════════════════════════════════════╗${RESET}`)
  console.log(`${BOLD}${GREEN}║   Farm-Link Zambia — RAG Advisor Test CLI    ║${RESET}`)
  console.log(`${BOLD}${GREEN}╚══════════════════════════════════════════════╝${RESET}`)
  console.log(`${GREY}  Type your farming question and press Enter.${RESET}`)
  console.log(`${GREY}  Type "exit" or Ctrl+C to quit.\n${RESET}`)

  function prompt() {
    rl.question(`${CYAN}You: ${RESET}`, async (input: string) => {
      const query = input.trim()

      if (!query) {
        prompt()
        return
      }

      if (query.toLowerCase() === 'exit') {
        console.log(`\n${GREY}Goodbye!${RESET}\n`)
        rl.close()
        process.exit(0)
      }

      console.log(`\n${YELLOW}Thinking...${RESET}`)

      try {
        const result = await askRag({
          query,
          userId: 'test-user',
          language: 'en',
          knowledgeBaseDocs: [],
        })

        console.log(`\n${GREEN}${BOLD}AI Advisor:${RESET}`)
        console.log(result.responseText)

        if (result.sourcedDocuments?.length) {
          console.log(`\n${GREY}Sources: ${result.sourcedDocuments.join(', ')}${RESET}`)
        }
        console.log()
      } catch (err: unknown) {
        console.error(
          `\n\x1b[31mError: ${err instanceof Error ? err.message : String(err)}\x1b[0m\n`
        )
      }

      prompt()
    })
  }

  prompt()
}

main().catch(console.error)

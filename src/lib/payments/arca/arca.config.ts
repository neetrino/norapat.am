import { ARCA_TEST_BASE_URL, ARCA_LIVE_BASE_URL } from './arca.constants'

export type ArcaCredentials = {
  userName: string
  password: string
}

export type ArcaConfig = {
  credentials: ArcaCredentials
  baseUrl: string
}

function trimEnv(value: string | undefined): string {
  return value?.trim() ?? ''
}

function shouldUseTestMode(
  mode: string | undefined,
  hasTest: boolean,
  hasLive: boolean
): boolean {
  if (mode === 'true') return true
  if (mode === 'false') return false
  // If only test pair is configured, default to test
  if (hasTest && !hasLive) return true
  return false
}

/**
 * Reads Arca credentials and base URL from environment variables.
 *
 * Env vars:
 *   ARCA_TEST_USERNAME / ARCA_TEST_PASSWORD  — test merchant credentials
 *   ARCA_LIVE_USERNAME / ARCA_LIVE_PASSWORD  — production merchant credentials
 *   ARCA_TEST_MODE=true|false                — force test or live mode
 *   ARCA_USE_DEV_STUB=true                   — dev-only stub (NODE_ENV=development)
 */
export function getArcaConfig(): ArcaConfig {
  const testUser = trimEnv(process.env.ARCA_TEST_USERNAME)
  const testPass = trimEnv(process.env.ARCA_TEST_PASSWORD)
  const liveUser = trimEnv(process.env.ARCA_LIVE_USERNAME)
  const livePass = trimEnv(process.env.ARCA_LIVE_PASSWORD)

  const hasTest = Boolean(testUser && testPass)
  const hasLive = Boolean(liveUser && livePass)
  const useTest = shouldUseTestMode(process.env.ARCA_TEST_MODE, hasTest, hasLive)

  const user = useTest ? testUser : liveUser
  const pass = useTest ? testPass : livePass

  if (user && pass) {
    return {
      credentials: { userName: user, password: pass },
      baseUrl: useTest ? ARCA_TEST_BASE_URL : ARCA_LIVE_BASE_URL,
    }
  }

  // Dev stub — never sends real requests; useful for local form testing
  const isDevStub =
    process.env.NODE_ENV === 'development' &&
    process.env.ARCA_USE_DEV_STUB === 'true'

  if (isDevStub) {
    return {
      credentials: {
        userName: 'dev-stub-arca-merchant',
        password: 'dev-stub-arca-password',
      },
      baseUrl: ARCA_TEST_BASE_URL,
    }
  }

  const hint = useTest
    ? 'Set ARCA_TEST_USERNAME and ARCA_TEST_PASSWORD, or ARCA_USE_DEV_STUB=true for local dev.'
    : 'Set ARCA_LIVE_USERNAME and ARCA_LIVE_PASSWORD (or ARCA_TEST_MODE=true with test keys).'
  throw new Error(`Arca is not configured: ${hint}`)
}

import {
  IDRAM_DEV_STUB_SECRET_PLACEHOLDER,
  IDRAM_DOC_SAMPLE_REC_ACCOUNT,
} from '@/lib/payments/idram/idram.constants'

export type IdramCredentials = {
  recAccount: string
  secretKey: string
}

function trimEnv(value: string | undefined): string {
  return value?.trim() ?? ''
}

/**
 * Whether to use test Idram keys (REC_ACCOUNT + SECRET_KEY from agreement).
 * - `IDRAM_TEST_MODE=true` → test keys only.
 * - `IDRAM_TEST_MODE=false` → live keys only.
 * - Unset: if only the test pair is filled, use test (common local dev); if both
 *   pairs exist, use live; if only live exists, use live.
 */
function shouldUseTestIdramKeys(
  mode: string | undefined,
  hasTestPair: boolean,
  hasLivePair: boolean
): boolean {
  if (mode === 'true') {
    return true
  }
  if (mode === 'false') {
    return false
  }
  if (hasTestPair && !hasLivePair) {
    return true
  }
  return false
}

/**
 * Reads test or live Idram credentials from environment.
 */
export function getIdramCredentials(): IdramCredentials {
  /** Primary names + aliases from older internal docs (TEST_*). */
  const testRec =
    trimEnv(process.env.IDRAM_REC_ACCOUNT) ||
    trimEnv(process.env.IDRAM_TEST_REC_ACCOUNT)
  const testSec =
    trimEnv(process.env.IDRAM_SECRET_KEY) ||
    trimEnv(process.env.IDRAM_TEST_SECRET_KEY)
  const liveRec = trimEnv(process.env.IDRAM_LIVE_REC_ACCOUNT)
  const liveSec = trimEnv(process.env.IDRAM_LIVE_SECRET_KEY)

  const hasTestPair = Boolean(testRec && testSec)
  const hasLivePair = Boolean(liveRec && liveSec)
  const useTest = shouldUseTestIdramKeys(
    process.env.IDRAM_TEST_MODE,
    hasTestPair,
    hasLivePair
  )

  const rec = useTest ? testRec : liveRec
  const sec = useTest ? testSec : liveSec

  if (rec && sec) {
    return { recAccount: rec, secretKey: sec }
  }

  const useDevStub =
    process.env.NODE_ENV === 'development' &&
    process.env.IDRAM_USE_DEV_STUB === 'true'

  if (useDevStub) {
    const stubSecret =
      trimEnv(process.env.IDRAM_DEV_STUB_SECRET) ||
      IDRAM_DEV_STUB_SECRET_PLACEHOLDER
    return {
      recAccount: IDRAM_DOC_SAMPLE_REC_ACCOUNT,
      secretKey: stubSecret,
    }
  }

  const hint = useTest
    ? 'Set IDRAM_REC_ACCOUNT and IDRAM_SECRET_KEY (aliases: IDRAM_TEST_REC_ACCOUNT, IDRAM_TEST_SECRET_KEY), IDRAM_USE_DEV_STUB=true for local dev only, or IDRAM_TEST_MODE=false with live keys.'
    : 'Set IDRAM_LIVE_REC_ACCOUNT and IDRAM_LIVE_SECRET_KEY (or IDRAM_TEST_MODE=true with test keys). For local dev without keys: IDRAM_USE_DEV_STUB=true.'
  throw new Error(`Idram is not configured: ${hint}`)
}

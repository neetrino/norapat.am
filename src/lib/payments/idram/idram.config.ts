export type IdramCredentials = {
  recAccount: string
  secretKey: string
}

/**
 * Reads test or live Idram credentials from environment.
 */
export function getIdramCredentials(): IdramCredentials {
  const useTest = process.env.IDRAM_TEST_MODE === 'true'
  const recAccount = useTest
    ? process.env.IDRAM_REC_ACCOUNT
    : process.env.IDRAM_LIVE_REC_ACCOUNT
  const secretKey = useTest
    ? process.env.IDRAM_SECRET_KEY
    : process.env.IDRAM_LIVE_SECRET_KEY

  const rec = recAccount?.trim() ?? ''
  const sec = secretKey?.trim() ?? ''
  if (!rec || !sec) {
    throw new Error(
      'Idram is not configured: set IDRAM_REC_ACCOUNT/IDRAM_SECRET_KEY or live pair'
    )
  }
  return { recAccount: rec, secretKey: sec }
}

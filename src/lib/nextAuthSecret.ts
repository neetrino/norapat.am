const DEV_NEXTAUTH_SECRET_FALLBACK = 'dev-fallback-secret'

export function resolveNextAuthSecret(): string | undefined {
  const configuredSecret = process.env.NEXTAUTH_SECRET
  if (configuredSecret) {
    return configuredSecret
  }

  if (process.env.NODE_ENV === 'production') {
    return undefined
  }

  return DEV_NEXTAUTH_SECRET_FALLBACK
}

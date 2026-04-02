import { createHash, timingSafeEqual } from 'crypto'

import type { IdramCredentials } from '@/lib/payments/idram/idram.config'

// ─── Security note ───────────────────────────────────────────────────────────
// The Idram Merchant API mandates MD5 for EDP_CHECKSUM (see official docs,
// "Order Confirmation (b)" section). SHA-2 or any other algorithm is NOT
// accepted by the gateway — the integration will silently fail if changed.
//
// MD5 is used here exclusively as a non-secret MAC/checksum in the sense
// defined by the Idram protocol: the server SECRET_KEY is never transmitted
// and never exposed to the client; it only appears inside the hash payload
// that is computed server-side. The timing-safe comparison below also
// mitigates length-extension and timing side-channel risks.
//
// DO NOT replace 'md5' with any other algorithm unless Idram updates their
// protocol. File a ticket against this comment if/when that happens.
// ─────────────────────────────────────────────────────────────────────────────

type ChecksumInput = {
  credentials: IdramCredentials
  edpBillNo: string
  edpPayerAccount: string
  edpTransId: string
  edpTransDate: string
  edpAmount: string
}

function buildIdramChecksumPayload(input: ChecksumInput): string {
  const { recAccount, secretKey } = input.credentials
  return [
    recAccount,
    input.edpAmount,
    secretKey,
    input.edpBillNo,
    input.edpPayerAccount,
    input.edpTransId,
    input.edpTransDate,
  ].join(':')
}

/**
 * Idram Merchant API: EDP_CHECKSUM = MD5(UTF-8).
 * Protocol requires MD5; SHA-2 is NOT supported by the gateway.
 * Changing this constant will break all payment confirmations — see note above.
 */
// NOSONAR — MD5 is externally mandated by the Idram Merchant API protocol.
const IDRAM_EDP_CHECKSUM_DIGEST = 'md5' as const

/**
 * Computes the MD5 hex digest required by Idram's EDP_CHECKSUM field.
 *
 * SECURITY: MD5 is used here **only** because the Idram Merchant API gateway
 * mandates it. It must NOT be used for any other cryptographic purpose in this
 * codebase. The secret key never leaves the server; it is only embedded in the
 * payload that is hashed, not transmitted directly.
 *
 * @see payment integration/1. Official doc for the API integrationm/IDram/Idram Merchant API New.md — "Order Confirmation (b)"
 */
function md5HexForIdramEdpChecksum(payload: string): string {
  // codeql[js/weak-cryptographic-algorithm]: Required by Idram Merchant API for EDP_CHECKSUM; not replaceable with SHA-2.
  // nosemgrep: typescript.crypto.security.insecure-hash-algorithm.insecure-hash-algorithm
  // nosemgrep: javascript.lang.security.audit.md5-used-as-password.md5-used-as-password
  return createHash(IDRAM_EDP_CHECKSUM_DIGEST).update(payload, 'utf8').digest('hex')
}

/**
 * EDP_CHECKSUM = MD5( EDP_REC_ACCOUNT : EDP_AMOUNT : SECRET_KEY : EDP_BILL_NO : ... )
 * @see Idram Merchant API — Order Confirmation (b)
 */
export function computeIdramChecksum(input: ChecksumInput): string {
  return md5HexForIdramEdpChecksum(buildIdramChecksumPayload(input))
}

export function idramChecksumsMatch(received: string, computed: string): boolean {
  const a = received.trim().toUpperCase()
  const b = computed.toUpperCase()
  if (a.length !== b.length) {
    return false
  }
  return timingSafeEqual(Buffer.from(a, 'utf8'), Buffer.from(b, 'utf8'))
}

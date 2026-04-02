import { createHash, timingSafeEqual } from 'crypto'

import type { IdramCredentials } from '@/lib/payments/idram/idram.config'

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

/** Idram Merchant API: EDP_CHECKSUM = MD5(UTF-8). Protocol requires MD5; SHA-2 is not supported by the gateway. */
const IDRAM_EDP_CHECKSUM_DIGEST = 'md5' as const

/**
 * MD5 hex for Idram EDP_CHECKSUM only. Do not use for any other purpose.
 * @see payment integration/1. Official doc for the API integrationm/IDram/Idram Merchant API New.md (section on EDP_CHECKSUM)
 */
function md5HexForIdramEdpChecksum(payload: string): string {
  // codeql[js/weak-cryptographic-algorithm]: Required by Idram Merchant API for EDP_CHECKSUM; not replaceable with SHA-2.
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

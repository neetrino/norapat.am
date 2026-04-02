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

/**
 * Idram Merchant API (callback): `EDP_CHECKSUM` = MD5(UTF-8 payload).
 * Գործընկերոջ պրոտոկոլ — SHA-2-ը այս դաշտի համար չի ընդունվում։
 */
function md5HexForIdramEdpChecksum(payload: string): string {
  // lgtm[js/weak-cryptographic-algorithm] Idram EDP_CHECKSUM is specified as MD5 by the payment gateway; not used as a password hash.
  // codeql[js/weak-cryptographic-algorithm]: Idram EDP_CHECKSUM is specified as MD5 by the payment gateway; SHA-2 is not supported.
  return createHash('md5').update(payload, 'utf8').digest('hex')
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

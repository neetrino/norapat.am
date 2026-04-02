import { createHash } from 'crypto'

import type { IdramCredentials } from '@/lib/payments/idram/idram.config'

type ChecksumInput = {
  credentials: IdramCredentials
  edpBillNo: string
  edpPayerAccount: string
  edpTransId: string
  edpTransDate: string
  edpAmount: string
}

/**
 * EDP_CHECKSUM = MD5( EDP_REC_ACCOUNT : EDP_AMOUNT : SECRET_KEY : EDP_BILL_NO : ... )
 * @see Idram Merchant API — Order Confirmation (b)
 */
export function computeIdramChecksum(input: ChecksumInput): string {
  const { recAccount, secretKey } = input.credentials
  const str = [
    recAccount,
    input.edpAmount,
    secretKey,
    input.edpBillNo,
    input.edpPayerAccount,
    input.edpTransId,
    input.edpTransDate,
  ].join(':')

  // codeql[js/weak-cryptographic-algorithm]: Idram Merchant API defines EDP_CHECKSUM as MD5 over colon-separated fields; SHA-2 is not accepted by the gateway.
  const checksumHex = createHash('md5').update(str, 'utf8').digest('hex')
  return checksumHex
}

export function idramChecksumsMatch(received: string, computed: string): boolean {
  return received.trim().toUpperCase() === computed.toUpperCase()
}

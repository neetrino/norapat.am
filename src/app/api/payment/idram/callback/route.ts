import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyIdramChecksum, isIdramConfigured } from '@/lib/idram'

/**
 * Idram RESULT_URL callback - handles:
 * 1. EDP_PRECHECK (Order Authenticity) - respond "OK" if order exists
 * 2. EDP_PAYER_ACCOUNT + EDP_CHECKSUM (Payment Confirmation) - verify and update order
 * Supports GET, POST, PUT as per Idram API
 */
export async function GET(request: NextRequest) {
  return handleCallback(request)
}

export async function POST(request: NextRequest) {
  return handleCallback(request)
}

export async function PUT(request: NextRequest) {
  return handleCallback(request)
}

function getParam(params: URLSearchParams | Record<string, string>, key: string): string {
  if (params instanceof URLSearchParams) {
    return params.get(key) ?? ''
  }
  return params[key] ?? ''
}

async function handleCallback(request: NextRequest) {
  try {
    if (!isIdramConfigured()) {
      return new NextResponse('Not configured', { status: 503 })
    }

    const url = new URL(request.url)
    let req: URLSearchParams | Record<string, string>

    if (request.method === 'GET') {
      req = url.searchParams
    } else {
      const contentType = request.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        req = (await request.json().catch(() => ({}))) as Record<string, string>
      } else {
        const text = await request.text()
        req = Object.fromEntries(new URLSearchParams(text))
      }
    }

    const get = (key: string) => getParam(req, key)

    const edpPrecheck = get('EDP_PRECHECK')
    const edpBillNo = get('EDP_BILL_NO')
    const edpRecAccount = get('EDP_REC_ACCOUNT')
    const edpAmount = get('EDP_AMOUNT')
    const edpPayerAccount = get('EDP_PAYER_ACCOUNT')
    const edpTransId = get('EDP_TRANS_ID')
    const edpTransDate = get('EDP_TRANS_DATE')
    const edpChecksum = get('EDP_CHECKSUM')

    const edpRecExpected = process.env.IDRAM_EDP_REC_ACCOUNT

    // 1. Order Authenticity (EDP_PRECHECK)
    if (edpPrecheck === 'YES' && edpBillNo && edpRecAccount && edpAmount) {
      if (edpRecAccount !== edpRecExpected) {
        return new NextResponse('Invalid account', { status: 400 })
      }
      const order = await prisma.order.findFirst({
        where: {
          id: edpBillNo,
          paymentMethod: 'idram',
          status: { in: ['PENDING', 'CONFIRMED'] }
        }
      })
      if (order) {
        return new NextResponse('OK')
      }
      return new NextResponse('Order not found', { status: 404 })
    }

    // 2. Payment Confirmation
    if (edpPayerAccount && edpBillNo && edpRecAccount && edpAmount && edpTransId && edpChecksum) {
      const valid = verifyIdramChecksum({
        edpRecAccount,
        edpAmount,
        edpBillNo,
        edpPayerAccount,
        edpTransId,
        edpTransDate,
        edpChecksum
      })

      const order = await prisma.order.findFirst({
        where: { id: edpBillNo, status: 'PENDING' }
      })

      if (!order) {
        return new NextResponse('Order not found', { status: 404 })
      }

      if (valid) {
        await prisma.order.update({
          where: { id: edpBillNo },
          data: {
            status: 'CONFIRMED',
            paymentMethod: 'idram'
          }
        })
        return new NextResponse('OK')
      }

      await prisma.order.update({
        where: { id: edpBillNo },
        data: { paymentMethod: 'idram' }
      })
    }

    return new NextResponse('Invalid request', { status: 400 })
  } catch (error) {
    console.error('Idram callback error:', error)
    return new NextResponse('Error', { status: 500 })
  }
}

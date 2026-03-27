/**
 * Cloudflare R2 — S3-совместимое хранилище.
 * Конфигурация из .env: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL, R2_ENDPOINT.
 */
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  type _Object
} from '@aws-sdk/client-s3'

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL
const R2_ENDPOINT = process.env.R2_ENDPOINT

const endpoint = R2_ENDPOINT ?? `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`

export const r2Client = new S3Client({
  region: 'auto',
  endpoint,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID ?? '',
    secretAccessKey: R2_SECRET_ACCESS_KEY ?? ''
  }
})

/** Проверяет наличие R2-конфигурации */
export function isR2Configured(): boolean {
  return Boolean(
    R2_ACCOUNT_ID &&
    R2_ACCESS_KEY_ID &&
    R2_SECRET_ACCESS_KEY &&
    R2_BUCKET_NAME &&
    R2_PUBLIC_URL
  )
}

/** Загружает файл в R2 и возвращает публичный URL */
export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<string> {
  if (!R2_BUCKET_NAME || !R2_PUBLIC_URL) {
    throw new Error('R2_BUCKET_NAME или R2_PUBLIC_URL не заданы')
  }

  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType
    })
  )

  const baseUrl = R2_PUBLIC_URL.replace(/\/$/, '')
  const normalizedKey = key.startsWith('/') ? key.slice(1) : key
  return `${baseUrl}/${normalizedKey}`
}

/** Список объектов в префиксе */
export async function listR2Objects(prefix: string): Promise<_Object[]> {
  if (!R2_BUCKET_NAME) {
    throw new Error('R2_BUCKET_NAME не задан')
  }

  const objects: _Object[] = []
  let continuationToken: string | undefined

  do {
    const response = await r2Client.send(
      new ListObjectsV2Command({
        Bucket: R2_BUCKET_NAME,
        Prefix: prefix,
        ContinuationToken: continuationToken
      })
    )
    if (response.Contents) objects.push(...response.Contents)
    continuationToken = response.NextContinuationToken
  } while (continuationToken)

  return objects
}

/** Удаляет объект из R2 */
export async function deleteFromR2(key: string): Promise<void> {
  if (!R2_BUCKET_NAME) {
    throw new Error('R2_BUCKET_NAME не задан')
  }

  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key
    })
  )
}

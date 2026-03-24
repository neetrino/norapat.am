import type { AppLocale } from '../types'
import { hy } from './hy'
import { en } from './en'
import { ru } from './ru'

export const dictionaries: Record<AppLocale, AppMessages> = {
  hy,
  en,
  ru,
}

export { hy, en, ru }

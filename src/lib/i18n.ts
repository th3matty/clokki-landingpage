import de from '../i18n/de.json'
import en from '../i18n/en.json'

export type Lang = 'de' | 'en'
export const LANGS: Lang[] = ['de', 'en']
export const DEFAULT_LANG: Lang = 'de'

const dicts: Record<Lang, unknown> = { de, en }

/**
 * Returns a translator bound to a language. Dotted keys traverse the dict.
 * Missing keys return the key itself (so missing strings are visible in dev).
 */
export function createT(lang: Lang) {
  const dict = dicts[lang]
  return function t(key: string): string {
    const value = key
      .split('.')
      .reduce<unknown>((acc, part) => {
        if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
          return (acc as Record<string, unknown>)[part]
        }
        return undefined
      }, dict)
    return typeof value === 'string' ? value : key
  }
}

/**
 * Array getter for list values in JSON (used for trust row, step lists, etc.).
 */
export function createTList(lang: Lang) {
  const dict = dicts[lang]
  return function tList(key: string): string[] {
    const value = key
      .split('.')
      .reduce<unknown>((acc, part) => {
        if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
          return (acc as Record<string, unknown>)[part]
        }
        return undefined
      }, dict)
    return Array.isArray(value) ? (value as string[]) : []
  }
}

export function otherLang(lang: Lang): Lang {
  return lang === 'de' ? 'en' : 'de'
}

/**
 * Builds the URL for the counterpart language, preserving path segments after /en.
 */
export function altUrl(currentLang: Lang, path: string): string {
  if (currentLang === 'de') {
    return path === '/' ? '/en/' : `/en${path}`
  }
  // en -> de: strip /en prefix
  const stripped = path.replace(/^\/en/, '') || '/'
  return stripped
}

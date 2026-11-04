import config from '../../pages.config.json'

/**
 * Single source of truth for prefetch lists (wraps pages.config.json).
 * Every page prefetches "all other pages", so adding a slug to the
 * registry updates all 8 prefetch lists with zero per-page edits.
 */
export const ALL_PAGES: string[] = config.pages

export function otherPages(current: string): string[] {
  return ALL_PAGES.filter((p) => p !== current)
}

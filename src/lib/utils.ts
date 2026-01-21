import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from 'crypto'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function hashIP(ip: string): string {
  return crypto
    .createHash('sha256')
    .update(ip + process.env.NEXTAUTH_SECRET)
    .digest('hex')
}

export function isAllowedDomain(url: string): boolean {
  try {
    const urlObj = new URL(url)
    const allowList = process.env.ALLOWLIST_DOMAINS?.split(',') || ['loveable.dev']
    
    return allowList.some(domain => {
      const trimmedDomain = domain.trim()
      if (trimmedDomain.startsWith('*.')) {
        const baseDomain = trimmedDomain.substring(2)
        return urlObj.hostname === baseDomain || urlObj.hostname.endsWith('.' + baseDomain)
      }
      return urlObj.hostname === trimmedDomain
    })
  } catch {
    return false
  }
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export async function fetchMetadata(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LearnSpace/1.0)'
      },
      signal: AbortSignal.timeout(10000)
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch')
    }
    
    const html = await response.text()
    
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const descMatch = html.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"']+)["\'][^>]*>/i)
    const ogTitleMatch = html.match(/<meta[^>]*property=["\']og:title["\'][^>]*content=["\']([^"']+)["\'][^>]*>/i)
    const ogDescMatch = html.match(/<meta[^>]*property=["\']og:description["\'][^>]*content=["\']([^"']+)["\'][^>]*>/i)
    const ogImageMatch = html.match(/<meta[^>]*property=["\']og:image["\'][^>]*content=["\']([^"']+)["\'][^>]*>/i)
    
    return {
      title: ogTitleMatch?.[1] || titleMatch?.[1] || 'Untitled',
      description: ogDescMatch?.[1] || descMatch?.[1] || null,
      thumbnail: ogImageMatch?.[1] || null,
    }
  } catch (error) {
    console.error('Failed to fetch metadata:', error)
    return {
      title: 'Untitled',
      description: null,
      thumbnail: null,
    }
  }
}
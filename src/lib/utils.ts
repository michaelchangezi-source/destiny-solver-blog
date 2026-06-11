import { clsx, type ClassValue } from 'clsx'
import { format, parseISO } from 'date-fns'
import { zhTW } from 'date-fns/locale/zh-TW'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'yyyy年M月d日', { locale: zhTW })
  } catch {
    return dateStr
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s\W]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

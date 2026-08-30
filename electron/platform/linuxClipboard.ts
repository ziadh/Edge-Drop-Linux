import { pathToFileURL, fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'

export type LinuxFileClipboardAction = 'copy' | 'cut'

export interface LinuxFileClipboardData {
  action: LinuxFileClipboardAction
  paths: string[]
}

export function parseUriList(raw: string): string[] {
  const paths: string[] = []
  for (const line of raw.split(/\r?\n/)) {
    const value = line.trim()
    if (!value || value.startsWith('#') || !value.toLowerCase().startsWith('file:')) continue
    try {
      const path = fileURLToPath(value)
      if (path && !paths.includes(path)) paths.push(path)
    } catch { /* malformed URI */ }
  }
  return paths
}

export function parseGnomeCopiedFiles(raw: string): LinuxFileClipboardData {
  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  const action = lines[0]?.toLowerCase() === 'cut' ? 'cut' : 'copy'
  const body = /^(copy|cut)$/i.test(lines[0] || '') ? lines.slice(1) : lines
  return { action, paths: parseUriList(body.join('\n')) }
}

export function encodeUriList(paths: string[]): string {
  return paths.map((path) => pathToFileURL(path).href).join('\r\n') + '\r\n'
}

export function encodeGnomeCopiedFiles(paths: string[], action: LinuxFileClipboardAction = 'copy'): string {
  return `${action}\n${paths.map((path) => pathToFileURL(path).href).join('\n')}\n`
}

export function filterExistingLinuxPaths(paths: string[]): string[] {
  return paths.filter((path, index) => paths.indexOf(path) === index && existsSync(path))
}

import { execFile } from 'node:child_process'
import type { DesktopCapabilities, PlatformOperationResult } from '../../shared/types'

export type DesktopSession = 'windows' | 'linux-x11' | 'linux-wayland' | 'unsupported'

export function getDesktopSession(
  platform = process.platform,
  env: NodeJS.ProcessEnv = process.env
): DesktopSession {
  if (platform === 'win32') return 'windows'
  if (platform !== 'linux') return 'unsupported'
  const session = (env.XDG_SESSION_TYPE || '').toLowerCase()
  if (session === 'wayland' || (!!env.WAYLAND_DISPLAY && !env.DISPLAY)) return 'linux-wayland'
  return 'linux-x11'
}

export function getDesktopCapabilities(
  platform = process.platform,
  env: NodeJS.ProcessEnv = process.env
): DesktopCapabilities {
  const session = getDesktopSession(platform, env)
  if (session === 'windows') {
    return { platform: 'windows', session, edgeActivation: true, autoPaste: true, fileClipboard: true, multiFileDrag: true, fullscreenDetection: true, launchAtLogin: true }
  }
  if (session === 'linux-x11') {
    return { platform: 'linux', session, edgeActivation: true, autoPaste: true, fileClipboard: true, multiFileDrag: true, fullscreenDetection: false, launchAtLogin: true }
  }
  if (session === 'linux-wayland') {
    return { platform: 'linux', session, edgeActivation: false, autoPaste: false, fileClipboard: true, multiFileDrag: true, fullscreenDetection: false, launchAtLogin: true }
  }
  return { platform: 'unsupported', session, edgeActivation: false, autoPaste: false, fileClipboard: false, multiFileDrag: false, fullscreenDetection: false, launchAtLogin: false }
}

export function simulatePlatformPaste(): Promise<PlatformOperationResult> {
  const capabilities = getDesktopCapabilities()
  if (!capabilities.autoPaste) {
    return Promise.resolve({ supported: false, ok: false, error: 'Automatic paste is unavailable in this desktop session. The item was copied instead.' })
  }
  if (process.platform === 'win32') {
    return Promise.resolve({ supported: true, ok: true })
  }
  return new Promise((resolve) => {
    execFile('xdotool', ['key', '--clearmodifiers', 'ctrl+v'], { timeout: 2000 }, (error) => {
      resolve(error
        ? { supported: false, ok: false, error: 'Install xdotool to enable automatic paste on X11. The item was copied instead.' }
        : { supported: true, ok: true })
    })
  })
}

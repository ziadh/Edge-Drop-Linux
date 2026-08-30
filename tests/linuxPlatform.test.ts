import { describe, expect, it } from 'vitest'
import { getDesktopCapabilities, getDesktopSession } from '../electron/platform/desktop'
import { encodeGnomeCopiedFiles, encodeUriList, parseGnomeCopiedFiles, parseUriList } from '../electron/platform/linuxClipboard'
import { buildLinuxAutostartEntry, getLinuxAutostartPath, linuxExecPath } from '../electron/main/loginItems'

describe('Linux desktop capabilities', () => {
  it('selects practical X11 capabilities', () => {
    expect(getDesktopSession('linux', { DISPLAY: ':0', XDG_SESSION_TYPE: 'x11' })).toBe('linux-x11')
    expect(getDesktopCapabilities('linux', { DISPLAY: ':0' })).toMatchObject({ edgeActivation: true, autoPaste: true, fileClipboard: true })
  })

  it('disables compositor-restricted Wayland behavior', () => {
    expect(getDesktopCapabilities('linux', { WAYLAND_DISPLAY: 'wayland-0', XDG_SESSION_TYPE: 'wayland' })).toMatchObject({
      session: 'linux-wayland', edgeActivation: false, autoPaste: false, fullscreenDetection: false
    })
  })
})

describe('Linux file clipboard formats', () => {
  const paths = ['/home/alice/hello world.txt', '/tmp/日本語.png']

  it('round-trips standard URI lists with comments and POSIX paths', () => {
    const encoded = encodeUriList(paths)
    expect(parseUriList(`# copied files\n${encoded}`)).toEqual(paths)
  })

  it('round-trips GNOME copy and cut payloads', () => {
    expect(parseGnomeCopiedFiles(encodeGnomeCopiedFiles(paths))).toEqual({ action: 'copy', paths })
    expect(parseGnomeCopiedFiles(encodeGnomeCopiedFiles(paths, 'cut'))).toEqual({ action: 'cut', paths })
  })

  it('ignores non-file and malformed URLs', () => {
    expect(parseUriList('https://example.com\nfile://%zz\n')).toEqual([])
  })
})

describe('XDG autostart', () => {
  it('uses XDG_CONFIG_HOME and safely quotes the executable', () => {
    expect(getLinuxAutostartPath({ XDG_CONFIG_HOME: '/tmp/config' })).toBe('/tmp/config/autostart/edge-drop.desktop')
    expect(buildLinuxAutostartEntry('/opt/Edge Drop/edge-drop')).toContain('Exec="/opt/Edge Drop/edge-drop" --hidden')
  })

  it('prefers $APPIMAGE over the mounted exe path so entries survive unmount', () => {
    expect(linuxExecPath({ APPIMAGE: '/home/alice/Downloads/Edge-Drop-1.0.0.AppImage' }))
      .toBe('/home/alice/Downloads/Edge-Drop-1.0.0.AppImage')
  })
})

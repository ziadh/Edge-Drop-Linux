/**
 * Native X11 global cursor position query, bypassing Electron's
 * `screen.getCursorScreenPoint()`.
 *
 * On some Linux/X11 setups (observed with an NVIDIA proprietary driver +
 * Chromium's Ozone/X11 backend), Electron's cursor API stops live-polling
 * the pointer and instead freezes at whatever position was last delivered
 * via a window-targeted input event. Since Edge-Drop's edge trigger is a
 * mostly click-through, unfocused window, it rarely receives such events,
 * so the frozen value never updates and hover activation silently never
 * arms — even though the poll timer itself is running correctly.
 *
 * The fix is to query the X server directly via libX11's XQueryPointer,
 * the same call `xdotool getmouselocation` uses under the hood. This
 * mirrors the existing pattern in window.ts, which already dlopens
 * user32.dll via koffi for Windows-only native calls. libX11.so.6 is a
 * hard runtime dependency of virtually every X11 desktop toolkit (GTK,
 * Qt, etc.), so it is always present alongside a running X11 session.
 */
import koffi from 'koffi'

export interface X11Point {
  x: number
  y: number
}

type XOpenDisplayFn = (name: string | null) => unknown
type XDefaultRootWindowFn = (display: unknown) => unknown
type XQueryPointerFn = (
  display: unknown,
  win: unknown,
  root: [unknown],
  child: [unknown],
  rootX: [number],
  rootY: [number],
  winX: [number],
  winY: [number],
  mask: [number]
) => number

let display: unknown = null
let rootWindow: unknown = null
let queryPointerFn: XQueryPointerFn | null = null
let initFailed = false

function ensureInit(): boolean {
  if (display && queryPointerFn) return true
  if (initFailed) return false
  try {
    const libX11 = koffi.load('libX11.so.6')
    const xOpenDisplay = libX11.func('void *XOpenDisplay(const char *name)') as XOpenDisplayFn
    const xDefaultRootWindow = libX11.func('unsigned long XDefaultRootWindow(void *display)') as XDefaultRootWindowFn
    queryPointerFn = libX11.func(
      'int XQueryPointer(void *display, unsigned long w, _Out_ unsigned long *root, _Out_ unsigned long *child, _Out_ int *rootX, _Out_ int *rootY, _Out_ int *winX, _Out_ int *winY, _Out_ unsigned int *mask)'
    ) as XQueryPointerFn

    const dpy = xOpenDisplay(null)
    if (!dpy) {
      console.error('[LinuxCursor] XOpenDisplay returned null — no X11 display available')
      initFailed = true
      return false
    }
    display = dpy
    rootWindow = xDefaultRootWindow(dpy)
    return true
  } catch (err) {
    console.error('[LinuxCursor] Failed to load libX11 for native cursor polling:', err)
    initFailed = true
    return false
  }
}

/**
 * Live global cursor position via a direct XQueryPointer call.
 * Returns null if libX11 couldn't be loaded/opened (caller should fall
 * back to Electron's screen.getCursorScreenPoint() in that case).
 */
export function getX11CursorPoint(): X11Point | null {
  if (!ensureInit() || !queryPointerFn) return null
  try {
    const rootRet: [unknown] = [0]
    const childRet: [unknown] = [0]
    const rootX: [number] = [0]
    const rootY: [number] = [0]
    const winX: [number] = [0]
    const winY: [number] = [0]
    const mask: [number] = [0]
    const ok = queryPointerFn(display, rootWindow, rootRet, childRet, rootX, rootY, winX, winY, mask)
    if (!ok) return null
    return { x: rootX[0], y: rootY[0] }
  } catch (err) {
    console.error('[LinuxCursor] XQueryPointer call failed:', err)
    initFailed = true
    return null
  }
}

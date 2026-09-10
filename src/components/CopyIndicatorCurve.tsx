/**
 * CopyIndicatorCurve — Fluid Sine-Curve SVG Morph with customizable indicator icons (Logo / Tick).
 *
 * Morphing SVG sine-wave arc (`sin(θ)`) that extends smoothly out from the screen
 * edge whenever content is copied to the clipboard, displaying the selected icon
 * animation (GSAP Liquid Octopus Logo or Animated Tick Icon) inside the curve peak.
 */
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/appStore'
import { LiquidOctopusLoader } from './LiquidOctopusLoader'
import { computePanelBand } from '../lib/panelGeometry'

export function TickIndicatorIcon({
  fillColor = '#ffffff',
  glowColor = 'rgba(255, 255, 255, 0.85)',
  size = 36
}: {
  color?: string
  fillColor?: string
  glowColor?: string
  size?: number
}) {
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: `drop-shadow(0 0 12px ${glowColor}) drop-shadow(0 0 4px ${glowColor})`
      }}
    >
      {/* Floating & Breathing Motion Wrapper */}
      <motion.div
        animate={{
          y: [-2, 2, -2],
          scale: [0.98, 1.03, 0.98]
        }}
        transition={{
          duration: 2.4,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror'
        }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="geometricPrecision"
          style={{ display: 'block', overflow: 'visible' }}
        >
          <motion.path
            d="M 5.0 12.5 L 9.5 17.0 L 22.8 2.8"
            stroke={fillColor}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
      </motion.div>
    </div>
  )
}

export function CopyIndicatorIcon({
  fillColor = '#ffffff',
  glowColor = 'rgba(255, 255, 255, 0.85)',
  size = 36
}: {
  fillColor?: string
  glowColor?: string
  size?: number
}) {
  const maskId = 'copy-icon-gap-mask'

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: `drop-shadow(0 0 10px ${glowColor})`
      }}
    >
      {/* Floating & Breathing Motion Wrapper */}
      <motion.div
        animate={{
          y: [-2.5, 2.5, -2.5],
          rotate: [-4, 4, -4],
          scale: [0.98, 1.04, 0.98]
        }}
        transition={{
          duration: 2.4,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror'
        }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          shapeRendering="geometricPrecision"
          style={{ display: 'block', overflow: 'visible' }}
        >
          <defs>
            <mask id={maskId}>
              {/* Base mask: keep everything */}
              <rect x="0" y="0" width="24" height="24" fill="#ffffff" />
              {/* Cutout gap around top-right sheet */}
              <rect x="6.8" y="0.8" width="16.4" height="16.4" rx="5.8" fill="#000000" />
            </mask>
          </defs>

          {/* Back Sheet (Bottom-Left) — masked to cut out a clean gap behind front sheet */}
          <motion.rect
            x="2.5"
            y="8.5"
            width="13"
            height="13"
            rx="4.2"
            fill={fillColor}
            mask={`url(#${maskId})`}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          />

          {/* Front Sheet (Top-Right) — pure solid fill with ZERO top/right borders */}
          <motion.rect
            x="8.5"
            y="2.5"
            width="13"
            height="13"
            rx="4.2"
            fill={fillColor}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 450, damping: 24, delay: 0.05 }}
          />
        </svg>
      </motion.div>
    </div>
  )
}

export function SparkleIndicatorIcon({
  fillColor = '#ffffff',
  glowColor = 'rgba(255, 255, 255, 0.85)',
  size = 36
}: {
  fillColor?: string
  glowColor?: string
  size?: number
}) {
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: `drop-shadow(0 0 10px ${glowColor})`
      }}
    >
      {/* Floating & Breathing Motion Wrapper */}
      <motion.div
        animate={{
          y: [-2.5, 2.5, -2.5],
          rotate: [-4, 4, -4],
          scale: [0.98, 1.04, 0.98]
        }}
        transition={{
          duration: 2.4,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror'
        }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          shapeRendering="geometricPrecision"
          style={{ display: 'block', overflow: 'visible' }}
        >
          {/* Main Sparkle (Top-Left) */}
          <motion.path
            d="M 9.5 1.5 C 9.5 5.8 5.8 9.5 1.5 9.5 C 5.8 9.5 9.5 13.2 9.5 17.5 C 9.5 13.2 13.2 9.5 17.5 9.5 C 13.2 9.5 9.5 5.8 9.5 1.5 Z"
            fill={fillColor}
            initial={{ scale: 0.3, rotate: -20, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
          />

          {/* Secondary Sparkle (Bottom-Right) */}
          <motion.path
            d="M 18.5 12.5 C 18.5 15.2 16.2 17.5 13.5 17.5 C 16.2 17.5 18.5 19.8 18.5 22.5 C 18.5 19.8 20.8 17.5 23.5 17.5 C 20.8 17.5 18.5 15.2 18.5 12.5 Z"
            fill={fillColor}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 450, damping: 22, delay: 0.08 }}
          />
        </svg>
      </motion.div>
    </div>
  )
}

export function CopyIndicatorCurve() {
  const copyFlareActive = useStore((s) => s.copyFlareActive)
  const flareKey = useStore((s) => s.flareKey)
  const open = useStore((s) => s.open)
  const settings = useStore((s) => s.settings)
  const isRight = settings.stickPosition === 'right'
  const isBottom = settings.stickPosition === 'bottom'
  const axis: 'x' | 'y' = (settings.stickPosition === 'top' || settings.stickPosition === 'bottom') ? 'y' : 'x'
  const indicatorStyle = settings.copyIndicatorStyle || 'logo'

  // Spans the full length of the hover bar trigger zone, along whichever
  // screen dimension matches the stuck edge's length axis.
  const triggerLengthPx = axis === 'x'
    ? window.innerHeight * (settings.hotZoneHeight || 0.25)
    : window.innerWidth * (settings.hotZoneHeight || 0.25)
  const H = triggerLengthPx
  const W = triggerLengthPx
  const bulge = 48
  const boxW = 75

  const hw = settings.hotZoneWidth || 3

  // Structurally matched Cubic Bezier paths for 100% smooth frame-by-frame interpolation
  const curvePathLeft = `M 0,0 L ${hw},0 C ${hw},${H * 0.22} ${bulge},${H * 0.28} ${bulge},${H / 2} C ${bulge},${H * 0.72} ${hw},${H * 0.78} ${hw},${H} L 0,${H} Z`
  const flatPathLeft = `M 0,0 L ${hw},0 C ${hw},${H * 0.22} ${hw},${H * 0.28} ${hw},${H / 2} C ${hw},${H * 0.72} ${hw},${H * 0.78} ${hw},${H} L 0,${H} Z`

  const curvePathRight = `M ${boxW},0 L ${boxW - hw},0 C ${boxW - hw},${H * 0.22} ${boxW - bulge},${H * 0.28} ${boxW - bulge},${H / 2} C ${boxW - bulge},${H * 0.72} ${boxW - hw},${H * 0.78} ${boxW - hw},${H} L ${boxW},${H} Z`
  const flatPathRight = `M ${boxW},0 L ${boxW - hw},0 C ${boxW - hw},${H * 0.22} ${boxW - hw},${H * 0.28} ${boxW - hw},${H / 2} C ${boxW - hw},${H * 0.72} ${boxW - hw},${H * 0.78} ${boxW - hw},${H} L ${boxW},${H} Z`

  // 90°-rotated (X<->Y swapped) mirrors of the paths above, for a top/bottom
  // (horizontal) trigger band: the curve bulges vertically instead of
  // horizontally, sweeping across W (the band's width) instead of H.
  const curvePathTop = `M 0,0 L 0,${hw} C ${W * 0.22},${hw} ${W * 0.28},${bulge} ${W / 2},${bulge} C ${W * 0.72},${bulge} ${W * 0.78},${hw} ${W},${hw} L ${W},0 Z`
  const flatPathTop = `M 0,0 L 0,${hw} C ${W * 0.22},${hw} ${W * 0.28},${hw} ${W / 2},${hw} C ${W * 0.72},${hw} ${W * 0.78},${hw} ${W},${hw} L ${W},0 Z`

  const curvePathBottom = `M 0,${boxW} L 0,${boxW - hw} C ${W * 0.22},${boxW - hw} ${W * 0.28},${boxW - bulge} ${W / 2},${boxW - bulge} C ${W * 0.72},${boxW - bulge} ${W * 0.78},${boxW - hw} ${W},${boxW - hw} L ${W},${boxW} Z`
  const flatPathBottom = `M 0,${boxW} L 0,${boxW - hw} C ${W * 0.22},${boxW - hw} ${W * 0.28},${boxW - hw} ${W / 2},${boxW - hw} C ${W * 0.72},${boxW - hw} ${W * 0.78},${boxW - hw} ${W},${boxW - hw} L ${W},${boxW} Z`

  const activePath = axis === 'y' ? (isBottom ? curvePathBottom : curvePathTop) : (isRight ? curvePathRight : curvePathLeft)
  const flatPath = axis === 'y' ? (isBottom ? flatPathBottom : flatPathTop) : (isRight ? flatPathRight : flatPathLeft)

  const showCurve = (settings.showCopyIndicator !== false) && copyFlareActive && !open

  const screenH = typeof window !== 'undefined' ? window.innerHeight : 800
  const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200
  const pFrac = settings.panelHeight || 0.6
  const vOffset = settings.verticalOffset ?? 0.5
  const hOffset = settings.horizontalOffset ?? 0.5
  const vBand = computePanelBand(screenH, vOffset, pFrac)
  const hBand = computePanelBand(screenW, hOffset, pFrac)
  const midY = vBand.mid
  const midX = hBand.mid

  const topOffset = `${midY}px`
  const leftOffset = `${midX}px`
  const yOffset = '-50%'
  const xOffset = '-50%'

  return (
    <AnimatePresence mode="popLayout">
      {showCurve && (
        <motion.div
          key={`copy-sine-curve-${flareKey}`}
          className={`copy-curve-container ${axis === 'y' ? (isBottom ? 'bottom' : 'top') : (isRight ? 'right' : 'left')}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          style={
            axis === 'y'
              ? {
                  position: 'absolute',
                  left: leftOffset,
                  x: xOffset,
                  [isBottom ? 'bottom' : 'top']: 0,
                  width: W,
                  height: boxW,
                  pointerEvents: 'none',
                  zIndex: 9999
                }
              : {
                  position: 'absolute',
                  top: topOffset,
                  y: yOffset,
                  [isRight ? 'right' : 'left']: 0,
                  width: boxW,
                  height: H,
                  pointerEvents: 'none',
                  zIndex: 9999
                }
          }
        >
          {/* SVG Sine-Curve Morph with Subpixel Geometric Precision Antialiasing */}
          <svg
            width={axis === 'y' ? W : boxW}
            height={axis === 'y' ? boxW : H}
            viewBox={axis === 'y' ? `0 0 ${W} ${boxW}` : `0 0 ${boxW} ${H}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            shapeRendering="geometricPrecision"
            style={{
              overflow: 'visible',
              shapeRendering: 'geometricPrecision',
              textRendering: 'geometricPrecision'
            }}
          >
            <motion.path
              d={activePath}
              fill="#000000"
              stroke="none"
              strokeWidth="0"
              shapeRendering="geometricPrecision"
              initial={{ d: flatPath }}
              animate={{ d: activePath }}
              exit={{ d: flatPath }}
              transition={{
                duration: 0.38,
                ease: [0.16, 1, 0.3, 1]
              }}
            />
          </svg>

          {/* Selected Copy Indicator Icon (Logo / Tick / Copy) centered inside the Curve Bulge */}
          <motion.div
            initial={axis === 'y' ? { scale: 0.3, opacity: 0, y: isBottom ? 10 : -10 } : { scale: 0.3, opacity: 0, x: isRight ? 10 : -10 }}
            animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
            exit={axis === 'y' ? { scale: 0.3, opacity: 0, y: isBottom ? 10 : -10 } : { scale: 0.3, opacity: 0, x: isRight ? 10 : -10 }}
            transition={{
              type: 'spring',
              stiffness: 420,
              damping: 24,
              delay: 0.05
            }}
            style={
              axis === 'y'
                ? {
                    position: 'absolute',
                    left: '50%',
                    x: '-50%',
                    [isBottom ? 'bottom' : 'top']: 2,
                    width: 43.3,
                    height: 43.3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none'
                  }
                : {
                    position: 'absolute',
                    top: '50%',
                    y: '-50%',
                    [isRight ? 'right' : 'left']: 2,
                    width: 43.3,
                    height: 43.3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none'
                  }
            }
          >
            {indicatorStyle === 'check' ? (
              <TickIndicatorIcon fillColor="#ffffff" glowColor="rgba(255, 255, 255, 0.85)" />
            ) : indicatorStyle === 'copy' ? (
              <CopyIndicatorIcon fillColor="#ffffff" glowColor="rgba(255, 255, 255, 0.85)" />
            ) : indicatorStyle === 'sparkle' ? (
              <SparkleIndicatorIcon fillColor="#ffffff" glowColor="rgba(255, 255, 255, 0.85)" />
            ) : (
              <LiquidOctopusLoader fillColor="#ffffff" glowColor="rgba(255, 255, 255, 0.85)" speed={1.2} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

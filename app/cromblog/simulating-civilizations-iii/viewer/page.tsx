'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

// ── Types ─────────────────────────────────────────────────────────────────────

interface SlimHex {
  q: number
  r: number
  t: string
  reg?: string
}

interface MapData {
  hexSize: number
  hexes: SlimHex[]
}

interface SimRegion {
  name: string
  display_name: string
  owner: string | null
  population: number
}

interface SimFaction {
  name: string
  display_name: string
  owned_region_count: number
  population: number
  treasury: number
}

interface SimWorld {
  turn: number
  turn_label: string
  factions: SimFaction[]
  regions: SimRegion[]
}

// ── Constants ─────────────────────────────────────────────────────────────────

const TERRAIN_COLORS: Record<string, string> = {
  ocean:        '#1a5c8a',
  coast:        '#4a9bb8',
  grassland:    '#c8d878',
  plains:       '#d4c080',
  hills:        '#a8a06a',
  forest:       '#4a7c4e',
  deep_forest:  '#2d5a32',
  jungle:       '#3a8c58',
  deep_jungle:  '#1a5c36',
  mountain:     '#8b8b8b',
  high_mountain:'#d0d0d0',
  wetland:      '#6a9b7c',
  lake:         '#6baed6',
  highland:     '#b09060',
  riverland:    '#7ab8a8',
}

const MAP_URL = '/cromblog/simulating-civilizations-iii/azhora-map.json'
const SIM_URL =
  'https://raw.githubusercontent.com/mcrombie/Clashvergence/main/reports/runs/azhora_sc4_live/sim_world.json'

// ── Hex math (pointy-top axial coords, matching World Builder) ────────────────

const SQRT3 = Math.sqrt(3)

function hexToPixel(q: number, r: number, sz: number): [number, number] {
  return [sz * (SQRT3 * q + (SQRT3 / 2) * r), sz * 1.5 * r]
}

function hexCorners(cx: number, cy: number, sz: number): [number, number][] {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i - 30)
    return [cx + sz * Math.cos(a), cy + sz * Math.sin(a)] as [number, number]
  })
}

function drawHex(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  sz: number,
  fill: string,
) {
  const c = hexCorners(cx, cy, sz)
  ctx.beginPath()
  ctx.moveTo(c[0][0], c[0][1])
  for (let i = 1; i < 6; i++) ctx.lineTo(c[i][0], c[i][1])
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
}

// ── Faction color — FNV-1a hash → HSL, exactly matching World Builder ─────────

function factionColor(name: string): string {
  let h = 2166136261
  for (let i = 0; i < name.length; i++) {
    h = (Math.imul(h ^ name.charCodeAt(i), 16777619)) >>> 0
  }
  return `hsl(${h % 360}, ${58 + ((h >>> 8) % 18)}%, ${42 + ((h >>> 16) % 12)}%)`
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AzhoraViewerPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mapRef    = useRef<MapData | null>(null)
  const simRef    = useRef<SimWorld | null>(null)
  const viewRef   = useRef({ x: 0, y: 0, zoom: 1 })
  const dragging  = useRef(false)
  const lastPos   = useRef({ x: 0, y: 0 })

  const [simWorld, setSimWorld] = useState<SimWorld | null>(null)
  const [status, setStatus]     = useState<'loading' | 'error' | 'ok'>('loading')

  // ── Render ──────────────────────────────────────────────────────────────────

  const render = useCallback(() => {
    const canvas = canvasRef.current
    const map    = mapRef.current
    const sim    = simRef.current
    if (!canvas || !map || !sim) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { hexes, hexSize } = map
    const { x: ox, y: oy, zoom } = viewRef.current

    const viewL = -ox / zoom
    const viewT = -oy / zoom
    const viewR = (canvas.width  - ox) / zoom
    const viewB = (canvas.height - oy) / zoom
    const pad   = hexSize * 2

    // Build lookup tables
    const regionOwner: Record<string, string | null> = {}
    for (const r of sim.regions) regionOwner[r.name] = r.owner

    const colorMap: Record<string, string> = {}
    for (const f of sim.factions) colorMap[f.name] = factionColor(f.name)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Dark background for ocean gaps
    ctx.fillStyle = '#0d2d45'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.save()
    ctx.setTransform(zoom, 0, 0, zoom, ox, oy)

    // ── Terrain layer ──
    ctx.globalAlpha = 0.7
    for (const h of hexes) {
      const [cx, cy] = hexToPixel(h.q, h.r, hexSize)
      if (cx + pad < viewL || cx - pad > viewR || cy + pad < viewT || cy - pad > viewB) continue
      drawHex(ctx, cx, cy, hexSize, TERRAIN_COLORS[h.t] ?? '#888')
    }
    ctx.globalAlpha = 1

    // ── Faction fill + centroid accumulation ──
    const centroids: Record<string, { x: number; y: number; n: number }> = {}
    ctx.globalAlpha = 0.62
    for (const h of hexes) {
      if (!h.reg) continue
      const owner = regionOwner[h.reg]
      const [cx, cy] = hexToPixel(h.q, h.r, hexSize)
      if (cx + pad < viewL || cx - pad > viewR || cy + pad < viewT || cy - pad > viewB) continue
      if (owner) {
        drawHex(ctx, cx, cy, hexSize, colorMap[owner] ?? '#888888')
        const c = centroids[owner] ?? (centroids[owner] = { x: 0, y: 0, n: 0 })
        c.x += cx; c.y += cy; c.n++
      } else {
        drawHex(ctx, cx, cy, hexSize, '#4a4a58')
      }
    }
    ctx.globalAlpha = 1

    // ── Faction name labels (visible when zoomed in enough) ──
    if (zoom >= 0.28) {
      const labelSz = hexSize * 1.7
      ctx.font = `bold ${labelSz}px sans-serif`
      ctx.textAlign    = 'center'
      ctx.textBaseline = 'middle'
      for (const f of sim.factions) {
        const c = centroids[f.name]
        if (!c || c.n < 5) continue
        const label = f.display_name.startsWith('The ')
          ? f.display_name.slice(4)
          : f.display_name
        const cx = c.x / c.n
        const cy = c.y / c.n
        ctx.lineWidth   = hexSize * 0.32
        ctx.strokeStyle = 'rgba(0,0,0,0.88)'
        ctx.strokeText(label, cx, cy)
        ctx.fillStyle = '#ffffff'
        ctx.fillText(label, cx, cy)
      }
    }

    ctx.restore()

    // ── HUD overlay ──
    ctx.fillStyle    = 'rgba(0,0,0,0.55)'
    ctx.fillRect(8, 8, 220, 40)
    ctx.fillStyle    = '#e8e8e8'
    ctx.font         = 'bold 13px sans-serif'
    ctx.textAlign    = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(`Turn ${sim.turn} · ${sim.turn_label}`, 16, 28)
  }, [])

  // ── Fit-to-view ─────────────────────────────────────────────────────────────

  const fitView = useCallback(
    (canvas: HTMLCanvasElement, hexes: SlimHex[], hexSize: number) => {
      let minX = Infinity, maxX = -Infinity
      let minY = Infinity, maxY = -Infinity
      for (const h of hexes) {
        const [cx, cy] = hexToPixel(h.q, h.r, hexSize)
        if (cx < minX) minX = cx
        if (cx > maxX) maxX = cx
        if (cy < minY) minY = cy
        if (cy > maxY) maxY = cy
      }
      const pad  = hexSize * 2.5
      const mapW = maxX - minX + pad * 2
      const mapH = maxY - minY + pad * 2
      const zoom = Math.min(canvas.width / mapW, canvas.height / mapH) * 0.97
      viewRef.current = {
        x:    (canvas.width  - mapW * zoom) / 2 + (pad - minX) * zoom,
        y:    (canvas.height - mapH * zoom) / 2 + (pad - minY) * zoom,
        zoom,
      }
    },
    [],
  )

  // ── Data load ───────────────────────────────────────────────────────────────

  useEffect(() => {
    Promise.all([
      fetch(MAP_URL).then((r) => r.json() as Promise<MapData>),
      fetch(SIM_URL).then((r) => r.json() as Promise<SimWorld>),
    ])
      .then(([map, sim]) => {
        mapRef.current = map
        simRef.current = sim
        setSimWorld(sim)
        setStatus('ok')
        const canvas = canvasRef.current
        if (canvas) {
          canvas.width  = canvas.offsetWidth
          canvas.height = canvas.offsetHeight
          fitView(canvas, map.hexes, map.hexSize)
          render()
        }
      })
      .catch(() => setStatus('error'))
  }, [fitView, render])

  // ── ResizeObserver ──────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ro = new ResizeObserver(() => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      const map = mapRef.current
      if (map) fitView(canvas, map.hexes, map.hexSize)
      render()
    })
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [fitView, render])

  // ── Interaction handlers ─────────────────────────────────────────────────────

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true
    lastPos.current  = { x: e.clientX, y: e.clientY }
  }, [])

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging.current) return
      viewRef.current.x += e.clientX - lastPos.current.x
      viewRef.current.y += e.clientY - lastPos.current.y
      lastPos.current = { x: e.clientX, y: e.clientY }
      render()
    },
    [render],
  )

  const onMouseUp = useCallback(() => { dragging.current = false }, [])

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const canvas = canvasRef.current
      if (!canvas) return
      const rect   = canvas.getBoundingClientRect()
      const mx     = e.clientX - rect.left
      const my     = e.clientY - rect.top
      const factor = e.deltaY > 0 ? 0.88 : 1.14
      const newZ   = Math.max(0.05, Math.min(10, viewRef.current.zoom * factor))
      const sc     = newZ / viewRef.current.zoom
      viewRef.current.x    = mx - sc * (mx - viewRef.current.x)
      viewRef.current.y    = my - sc * (my - viewRef.current.y)
      viewRef.current.zoom = newZ
      render()
    },
    [render],
  )

  const onDoubleClick = useCallback(() => {
    const canvas = canvasRef.current
    const map    = mapRef.current
    if (!canvas || !map) return
    fitView(canvas, map.hexes, map.hexSize)
    render()
  }, [fitView, render])

  // ── Faction list (sorted by region count) ───────────────────────────────────

  const sortedFactions =
    simWorld?.factions.slice().sort((a, b) => b.owned_region_count - a.owned_region_count) ?? []

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0d1117',
        color: '#e6edf3',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Nav bar */}
      <div
        style={{
          padding: '10px 20px',
          borderBottom: '1px solid #21262d',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexShrink: 0,
        }}
      >
        <Link
          href="/cromblog/simulating-civilizations-iii"
          style={{ color: '#58a6ff', textDecoration: 'none', fontSize: 13 }}
        >
          ← Simulating Civilizations III
        </Link>
        <span style={{ color: '#484f58', fontSize: 13 }}>|</span>
        <span style={{ fontSize: 13, color: '#8b949e' }}>
          Azhora · Century Waves — Live Viewer
        </span>
      </div>

      {/* Canvas area */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        {status === 'loading' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8b949e',
              fontSize: 14,
            }}
          >
            Loading map…
          </div>
        )}
        {status === 'error' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 8,
              color: '#f85149',
              fontSize: 14,
            }}
          >
            <span>Could not load simulation data.</span>
            <span style={{ color: '#8b949e', fontSize: 12 }}>
              The live data file may not be available yet. Check back after the next
              daily advance.
            </span>
          </div>
        )}
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            cursor: dragging.current ? 'grabbing' : 'grab',
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onWheel={onWheel}
          onDoubleClick={onDoubleClick}
        />
      </div>

      {/* Faction legend */}
      {simWorld && (
        <div
          style={{
            borderTop: '1px solid #21262d',
            padding: '12px 20px',
            flexShrink: 0,
            maxHeight: 200,
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: '#8b949e',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 8,
            }}
          >
            Living factions — {sortedFactions.length} remaining
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '4px 16px',
            }}
          >
            {sortedFactions.map((f) => (
              <div
                key={f.name}
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: factionColor(f.name),
                    flexShrink: 0,
                  }}
                />
                <span style={{ color: '#e6edf3', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {f.display_name}
                </span>
                <span style={{ color: '#6e7681', whiteSpace: 'nowrap' }}>
                  {f.owned_region_count}r
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: '#484f58' }}>
            Scroll to zoom · drag to pan · double-click to reset view
          </div>
        </div>
      )}
    </div>
  )
}

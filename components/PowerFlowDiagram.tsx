// Interactive Power Automate-style flow diagram.
// Cards are draggable (pointer-based). Connectors update live as you drag.
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, forwardRef } from 'react';
import type { PowerFlow, StepType } from '../data/powerFlows';
import { ServiceIcon } from './ServiceIcon';

const TYPE_COLORS: Record<StepType, { accent: string; bg: string; label: string }> = {
  trigger:   { accent: '#D13438', bg: '#FDECEA', label: 'TRIGGER' },
  action:    { accent: '#0066FF', bg: '#E5F1FB', label: 'ACTION' },
  condition: { accent: '#F0A30A', bg: '#FFF8E1', label: 'CONDITION' },
  loop:      { accent: '#7B1FA2', bg: '#F3E5F5', label: 'APPLY TO EACH' },
  end:       { accent: '#107C10', bg: '#DFF6DD', label: 'ACTION' },
};

interface Pt { x: number; y: number; }

interface Props {
  flow: PowerFlow;
  /** width of card column (cards stretch full width minus padding). default 300 */
  cardWidth?: number;
  /** if true, cards cannot be dragged (used for static preview). default false */
  readOnly?: boolean;
  /** override container height (auto-computed otherwise) */
  height?: number;
  /** scale factor for compact previews */
  scale?: number;
  /** when true, the diagram measures its parent and auto-scales to fit */
  autoFit?: boolean;
  /** minimum auto-fit scale (never shrink past this). default 0.5 */
  minScale?: number;
  /** maximum auto-fit scale (allow scaling up to fill space). default 1.6 */
  maxScale?: number;
  /** when true, the built-in Reset button is hidden (parent renders its own) */
  hideResetButton?: boolean;
}

export interface PowerFlowDiagramHandle {
  reset: () => void;
}

const CARD_H = 78;
const GAP = 36;
const PAD = 28;
const COL_GAP = 60; // horizontal gap between columns in 2-col layout
const FIT_INSET = 12; // breathing room inside the wrapper when auto-fitting

// Compute default positions for a given column count.
// 2-col: fills left column top→bottom, then right column top→bottom.
function computePositions(n: number, cols: number, cardWidth: number): Pt[] {
  if (cols <= 1) {
    return Array.from({ length: n }, (_, i) => ({ x: PAD, y: PAD + i * (CARD_H + GAP) }));
  }
  const perCol = Math.ceil(n / 2);
  return Array.from({ length: n }, (_, i) => {
    const col = i < perCol ? 0 : 1;
    const row = i < perCol ? i : i - perCol;
    return { x: PAD + col * (cardWidth + COL_GAP), y: PAD + row * (CARD_H + GAP) };
  });
}

function computeGeometry(n: number, cols: number, cardWidth: number) {
  const rows = cols <= 1 ? n : Math.ceil(n / 2);
  const w = PAD * 2 + cardWidth * cols + (cols - 1) * COL_GAP;
  const h = PAD * 2 + rows * (CARD_H + GAP) - GAP;
  return { w, h };
}

export const PowerFlowDiagram = forwardRef<PowerFlowDiagramHandle, Props>(function PowerFlowDiagram({
  flow,
  cardWidth = 300,
  readOnly = false,
  height,
  scale: scaleProp = 1,
  autoFit = false,
  minScale = 0.5,
  maxScale = 1.6,
  hideResetButton = false,
}, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const [columns, setColumns] = useState(1);
  const scale = autoFit ? fitScale : scaleProp;

  // Natural (unscaled) dimensions based on current column count
  const geom = useMemo(() => computeGeometry(flow.steps.length, columns, cardWidth), [flow.steps.length, columns, cardWidth]);
  const naturalH = height ?? geom.h;
  const naturalW = geom.w;

  // Auto-fit: observe wrapper size, try 1-col vs 2-col, pick whichever fits better
  useEffect(() => {
    if (!autoFit) return;
    const el = wrapperRef.current;
    if (!el) return;
    const n = flow.steps.length;
    const recompute = () => {
      const availH = Math.max(0, el.clientHeight - FIT_INSET * 2);
      const availW = Math.max(0, el.clientWidth - FIT_INSET * 2);
      if (availH <= 0 || availW <= 0) return;
      const fitFor = (cols: number) => {
        const g = computeGeometry(n, cols, cardWidth);
        return Math.min(availH / g.h, availW / g.w);
      };
      const s1 = fitFor(1);
      const s2 = n >= 4 ? fitFor(2) : 0; // 2-col only worth trying with enough steps
      let chosenCols = 1;
      let chosenScale = s1;
      // Respect explicit preference from the flow definition
      if (flow.preferTwoColumn && n >= 4 && s2 > 0) {
        chosenCols = 2;
        chosenScale = s2;
      } else if (s1 < 0.85 && s2 > s1 * 1.05) {
        // Otherwise: prefer 2-col when 1-col would shrink noticeably AND 2-col gives a better scale
        chosenCols = 2;
        chosenScale = s2;
      }
      setColumns(prev => (prev === chosenCols ? prev : chosenCols));
      setFitScale(Math.min(maxScale, Math.max(minScale, chosenScale)));
    };
    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [autoFit, flow.steps.length, flow.preferTwoColumn, cardWidth, minScale, maxScale]);

  // Default positions depend on column count
  const defaultPositions = useMemo<Pt[]>(
    () => computePositions(flow.steps.length, columns, cardWidth),
    [flow.steps.length, columns, cardWidth]
  );
  const [positions, setPositions] = useState<Pt[]>(defaultPositions);
  // Reset when flow changes
  useEffect(() => { setPositions(defaultPositions); }, [defaultPositions]);

  const drag = useRef<{ idx: number; offsetX: number; offsetY: number } | null>(null);

  const onPointerDown = useCallback((idx: number, e: React.PointerEvent) => {
    if (readOnly) return;
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    drag.current = {
      idx,
      offsetX: (e.clientX - rect.left) / scale - positions[idx].x,
      offsetY: (e.clientY - rect.top) / scale - positions[idx].y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [readOnly, positions, scale]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const { idx, offsetX, offsetY } = drag.current;
    const newX = (e.clientX - rect.left) / scale - offsetX;
    const newY = (e.clientY - rect.top) / scale - offsetY;
    setPositions(prev => prev.map((p, i) => (i === idx ? { x: newX, y: newY } : p)));
  }, [scale]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (drag.current) {
      try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
      drag.current = null;
    }
  }, []);

  const resetLayout = () => setPositions(defaultPositions);

  useImperativeHandle(ref, () => ({ reset: resetLayout }), [defaultPositions]);

  // Compute canvas size
  const computedH = naturalH;
  const innerW = naturalW;

  // Connector lines (curved arrows between consecutive cards)
  const connectors = positions.slice(0, -1).map((p, i) => {
    const next = positions[i + 1];
    const sameColumn = Math.abs(next.x - p.x) < 1;
    if (sameColumn) {
      // straight vertical S-curve between centers
      const x1 = p.x + cardWidth / 2;
      const y1 = p.y + CARD_H;
      const x2 = next.x + cardWidth / 2;
      const y2 = next.y;
      const my = (y1 + y2) / 2;
      const d = `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2 - 6}`;
      return { d, key: i };
    }
    // Cross-column bridge: exit right side of source, route up & over, enter top of target
    const x1 = p.x + cardWidth;
    const y1 = p.y + CARD_H / 2;
    const x2 = next.x + cardWidth / 2;
    const y2 = next.y;
    const midX = (x1 + x2) / 2;
    const topY = Math.min(y1, y2) - 30;
    const d = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${topY}, ${x2} ${topY} L ${x2} ${y2 - 6}`;
    return { d, key: i };
  });

  return (
    <div ref={wrapperRef} className="relative w-full h-full flex flex-col items-center justify-center">
      {!readOnly && !hideResetButton && (
        <button
          type="button"
          onClick={resetLayout}
          className="absolute -top-3 right-2 z-30 bg-white text-black px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border-[2px] border-black shadow-[2px_2px_0px_#000] hover:bg-[#FFD600] transition-colors"
        >
          Reset
        </button>
      )}
      <div
        ref={containerRef}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{
          width: innerW * scale,
          height: computedH * scale,
          touchAction: 'none',
        }}
        className="relative bg-[repeating-linear-gradient(0deg,#f3f2f1_0,#f3f2f1_19px,#e1dfdd_20px),repeating-linear-gradient(90deg,#f3f2f1_0,#f3f2f1_19px,#e1dfdd_20px)] border-[3px] border-black overflow-hidden select-none"
      >
        <div
          style={{
            width: innerW,
            height: computedH,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'relative',
          }}
        >
          {/* SVG connector layer */}
          <svg
            width={innerW}
            height={computedH}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          >
            <defs>
              <marker id={`arr-${flow.id}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 Z" fill="#605E5C" />
              </marker>
            </defs>
            {connectors.map(c => (
              <path
                key={c.key}
                d={c.d}
                stroke="#605E5C"
                strokeWidth="2"
                strokeDasharray="5 4"
                fill="none"
                markerEnd={`url(#arr-${flow.id})`}
              />
            ))}
          </svg>

          {/* Cards */}
          {flow.steps.map((step, i) => {
            const c = TYPE_COLORS[step.type];
            const pos = positions[i];
            return (
              <div
                key={i}
                onPointerDown={(e) => onPointerDown(i, e)}
                style={{
                  position: 'absolute',
                  left: pos.x,
                  top: pos.y,
                  width: cardWidth,
                  height: CARD_H,
                  cursor: readOnly ? 'default' : (drag.current?.idx === i ? 'grabbing' : 'grab'),
                  borderColor: c.accent,
                  boxShadow: '3px 3px 0 rgba(0,0,0,0.85)',
                }}
                className="bg-white border-[2px] flex items-center gap-3 px-3 rounded-sm hover:shadow-[5px_5px_0_rgba(0,0,0,0.85)] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-transform"
              >
                {/* Left color strip */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[5px]"
                  style={{ backgroundColor: c.accent }}
                />
                {/* Icon tile */}
                <div
                  className="flex-shrink-0 w-12 h-12 rounded flex items-center justify-center ml-1.5"
                  style={{ backgroundColor: c.bg, border: `1px solid ${c.accent}55` }}
                >
                  <ServiceIcon service={step.service} size={36} />
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div
                    className="text-[9px] font-black tracking-[1.2px]"
                    style={{ color: c.accent }}
                  >
                    {c.label}
                  </div>
                  <div className="text-[12px] font-bold text-[#201F1E] truncate leading-tight">
                    {step.label}
                  </div>
                  <div className="text-[10px] text-[#605E5C] truncate">
                    {step.sub}
                  </div>
                </div>
                {/* Step number badge */}
                <div
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black text-white border-2 border-white"
                  style={{ backgroundColor: c.accent, boxShadow: '1px 1px 0 rgba(0,0,0,0.5)' }}
                >
                  {i + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {!readOnly && (
        <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-center">
          ✋ Drag cards to rearrange · Click <span className="underline">Reset</span> to restore
        </div>
      )}
    </div>
  );
});

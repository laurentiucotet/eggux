// Pointer drag to reorder a vertical list. Rows carry data-reorder-id; the grip gets gripProps(id).
// The drag starts after 4 px of movement (a click on the grip stays a click), the drop position is
// the row whose middle is below the pointer, Escape or pointercancel restores the order. Keyboard
// reordering stays with the component (Space + arrows, Alt + arrows); this hook adds the pointer.
import * as React from 'react';

export interface PointerReorderOptions {
  order: string[];
  onReorder: (next: string[], movedId: string) => void;
  /** Rows that cannot move or be passed (the locked first column). */
  isLocked?: (id: string) => boolean;
  disabled?: boolean;
}

export interface PointerReorderState {
  /** Id being dragged. */
  dragId: string | null;
  /** Insert-before index (0..order.length). */
  overIndex: number | null;
}

function usePointerReorder({ order, onReorder, isLocked, disabled = false }: PointerReorderOptions) {
  const containerRef = React.useRef<HTMLElement | null>(null);
  const start = React.useRef<{ id: string; y: number; active: boolean } | null>(null);
  const [state, setState] = React.useState<PointerReorderState>({ dragId: null, overIndex: null });
  const stateRef = React.useRef(state);
  stateRef.current = state;

  const firstMovable = Math.max(0, order.findIndex(id => !isLocked?.(id)));
  const reset = () => { start.current = null; setState({ dragId: null, overIndex: null }); };

  const overFromY = (y: number) => {
    const rows = Array.from(containerRef.current?.querySelectorAll<HTMLElement>('[data-reorder-id]') ?? []);
    let i = rows.findIndex(r => { const b = r.getBoundingClientRect(); return y < b.top + b.height / 2; });
    if (i < 0) i = rows.length;
    return Math.max(firstMovable, i);
  };

  React.useEffect(() => {
    if (!state.dragId) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); reset(); } };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [state.dragId]);

  const gripProps = (id: string) => ({
    style: { touchAction: 'none' } as React.CSSProperties,
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
      if (disabled || e.button !== 0 || isLocked?.(id)) return;
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* synthetic pointers */ }
      start.current = { id, y: e.clientY, active: false };
    },
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
      const s = start.current;
      if (!s) return;
      if (!s.active && Math.abs(e.clientY - s.y) < 4) return;
      s.active = true;
      e.preventDefault();
      const over = overFromY(e.clientY);
      if (stateRef.current.dragId !== s.id || stateRef.current.overIndex !== over) setState({ dragId: s.id, overIndex: over });
    },
    onPointerUp: () => {
      const s = start.current;
      const { overIndex } = stateRef.current;
      if (s?.active && overIndex !== null) {
        const from = order.indexOf(s.id);
        const to = overIndex > from ? overIndex - 1 : overIndex;
        if (to !== from) {
          const next = order.filter(x => x !== s.id);
          next.splice(to, 0, s.id);
          onReorder(next, s.id);
        }
      }
      reset();
    },
    onPointerCancel: reset,
  });

  return { containerRef, dragId: state.dragId, overIndex: state.overIndex, gripProps };
}

export { usePointerReorder };

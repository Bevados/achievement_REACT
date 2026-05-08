import { useEffect, useRef, useState } from 'react';
import type { EntryView } from '../../../contracts/collection.contracts';
import EntryCard from './EntryCard';

interface EntriesGridProps {
  entries: EntryView[];
  emptyMessage: string;
  showActions?: boolean;
}

const DESKTOP_MEDIA_QUERY = '(min-width: 1024px)';
const DESKTOP_ROW_HEIGHT = 8;
const DESKTOP_ROW_GAP = 16;

export default function EntriesGrid({ entries, emptyMessage, showActions = true }: EntriesGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef(new Map<string, HTMLDivElement>());
  const [rowSpans, setRowSpans] = useState<Record<string, number>>({});

  useEffect(() => {
    if (entries.length === 0 || typeof window === 'undefined') {
      return undefined;
    }

    const resizeItems = () => {
      const isDesktop =
        typeof window.matchMedia === 'function'
          ? window.matchMedia(DESKTOP_MEDIA_QUERY).matches
          : false;

      if (!isDesktop) {
        setRowSpans((current) => (Object.keys(current).length === 0 ? current : {}));
        return;
      }

      setRowSpans((current) => {
        const next: Record<string, number> = {};
        let changed = Object.keys(current).length !== entries.length;

        for (const entry of entries) {
          const node = itemRefs.current.get(entry.id);
          if (!node) {
            continue;
          }

          const height = node.getBoundingClientRect().height;
          const span = Math.max(1, Math.ceil((height + DESKTOP_ROW_GAP) / (DESKTOP_ROW_HEIGHT + DESKTOP_ROW_GAP)));
          next[entry.id] = span;

          if (current[entry.id] !== span) {
            changed = true;
          }
        }

        return changed ? next : current;
      });
    };

    const scheduleResize = () => {
      window.requestAnimationFrame(resizeItems);
    };

    scheduleResize();

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(scheduleResize) : null;

    if (resizeObserver) {
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      for (const node of itemRefs.current.values()) {
        resizeObserver.observe(node);
      }
    }

    window.addEventListener('resize', scheduleResize);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', scheduleResize);
    };
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 text-sm text-gray-600">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="grid gap-4 lg:grid-cols-2 lg:auto-rows-[8px] lg:items-start"
    >
      {entries.map((entry) => (
        <div
          key={entry.id}
          ref={(node) => {
            if (node) {
              itemRefs.current.set(entry.id, node);
            } else {
              itemRefs.current.delete(entry.id);
            }
          }}
          data-testid="entry-grid-item"
          style={rowSpans[entry.id] ? { gridRowEnd: `span ${rowSpans[entry.id]}` } : undefined}
        >
          <EntryCard entry={entry} showActions={showActions} />
        </div>
      ))}
    </div>
  );
}

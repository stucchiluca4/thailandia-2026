'use client';
/* ═══════════ ITINERARIO · lista giorni ═══════════ */
import { useRef, useEffect } from 'react';
import { DAYS } from '@/data/itinerary';
import { useNow, dayState, fmtDate } from '@/lib/time';
import { DayCard } from '@/components/DayCard';

export default function Itinerario() {
  const now = useNow();
  const today = fmtDate(now);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scroller.current?.querySelector('[data-today="1"]');
    el?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, []);

  return (
    <div className="px-4 pt-3">
      {/* scrubber date */}
      <div ref={scroller} className="flex gap-2 overflow-x-auto no-scrollbar pb-3 -mx-4 px-4">
        {DAYS.map(d => {
          const isToday = d.date === today;
          return (
            <a key={d.id} href={'#' + d.id} data-today={isToday ? '1' : undefined}
              className={`shrink-0 w-11 text-center py-2 rounded-2xl ${isToday ? 'bg-tropic text-white font-black' : 'bg-surface border border-line'}`}>
              <div className="text-[8.5px] font-extrabold opacity-80">{d.w.toUpperCase()}</div>
              <div className="text-[15px] font-black">{d.n}</div>
            </a>
          );
        })}
      </div>
      {DAYS.map(d => (
        <div key={d.id} id={d.id} className="scroll-mt-20">
          <DayCard day={d} defaultOpen={dayState(d, now) === 'today'} />
        </div>
      ))}
      <div className="h-6" />
    </div>
  );
}

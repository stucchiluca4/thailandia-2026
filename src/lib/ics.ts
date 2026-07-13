/* ═══════════ ICS · export promemoria nel Calendario ═══════════ */
import { DAYS } from '@/data/itinerary';

export function buildICS() {
  const dt = (date: string, time: string) => date.replace(/-/g, '') + 'T' + time.replace(':', '') + '00';
  const esc = (s: string) => s.replace(/[,;]/g, m => '\\' + m).replace(/\n/g, '\\n');
  const ev: string[] = [];
  const push = (date: string, start: string, end: string, title: string, desc: string, alarmMin: number) => {
    ev.push(['BEGIN:VEVENT',
      'UID:' + Math.random().toString(36).slice(2) + '@th2026',
      'DTSTART;TZID=Asia/Bangkok:' + dt(date, start),
      'DTEND;TZID=Asia/Bangkok:' + dt(date, end || start),
      'SUMMARY:' + esc(title),
      desc ? 'DESCRIPTION:' + esc(desc) : '',
      'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + esc(title),
      `TRIGGER:-PT${alarmMin}M`, 'END:VALARM', 'END:VEVENT'].filter(Boolean).join('\r\n'));
  };
  DAYS.forEach(day => {
    day.acts.forEach(a => {
      const isFlight = /volo/i.test(a.name);
      if (isFlight) push(day.date, a.t, a.e, '✈️ ' + a.name, a.desc ?? '', 180);
      else if (/check-in|check-out/i.test(a.name)) push(day.date, a.t, a.e, '🏨 ' + a.name, a.desc ?? '', 60);
      else if (a.status) push(day.date, a.t, a.e, a.name, a.desc ?? '', 60);
    });
    day.transports.forEach(t => {
      if (/✈|🚌|⛵|🚐/.test(t.mode)) push(day.date, t.time, t.time, `${t.mode.slice(0, 2)} ${t.from} → ${t.to}`, t.note ?? '', 120);
    });
  });
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Thailandia2026//IT', 'CALSCALE:GREGORIAN', ...ev, 'END:VCALENDAR'].join('\r\n');
}
export function downloadICS() {
  const blob = new Blob([buildICS()], { type: 'text/calendar' });
  const a = document.createElement('a');
  a.href = window.URL.createObjectURL(blob);
  a.download = 'thailandia-2026-promemoria.ics';
  a.click();
  setTimeout(() => window.URL.revokeObjectURL(a.href), 5000);
}

const EVENT_CONFIG = [
  {
    id: "world-cup-2026",
    label: "World Cup",
    href: "/events/world-cup",
    startsAt: "2026-06-11",
    endsAt: "2026-07-19",
    tone: "gold",
  },
  {
    id: "christmas",
    label: "Noel",
    href: "/events/christmas",
    startsAt: "12-20",
    endsAt: "12-26",
    tone: "red",
    yearly: true,
  },
];

const DEFAULT_EVENT = {
  id: "default",
  label: "Sự kiện",
  href: "/events",
  tone: "neutral",
};

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isDateInRange(date, event) {
  if (event.yearly) {
    const year = date.getFullYear();
    const current = getDateKey(date);
    return current >= `${year}-${event.startsAt}` && current <= `${year}-${event.endsAt}`;
  }

  const current = getDateKey(date);
  return current >= event.startsAt && current <= event.endsAt;
}

export function getCurrentEvent(date = new Date()) {
  return EVENT_CONFIG.find((event) => isDateInRange(date, event)) || DEFAULT_EVENT;
}

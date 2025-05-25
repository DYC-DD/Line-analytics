export function messageCountByDay(messages) {
  const counter = {};

  for (const msg of messages) {
    const date = new Date(msg.datetime);
    const isoDate = date.toISOString().split("T")[0];
    counter[isoDate] = (counter[isoDate] || 0) + 1;
  }

  return counter;
}

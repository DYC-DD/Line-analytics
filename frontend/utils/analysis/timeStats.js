export function hourlyDistribution(messages) {
  const counter = {};

  for (const msg of messages) {
    const date = new Date(msg.datetime);
    const hour = date.getHours();
    counter[hour] = (counter[hour] || 0) + 1;
  }

  return counter;
}

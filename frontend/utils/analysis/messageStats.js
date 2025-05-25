export function messageCountBySender(messages) {
  const counter = {};

  for (const msg of messages) {
    const sender = msg.sender;
    counter[sender] = (counter[sender] || 0) + 1;
  }

  const total = Object.values(counter).reduce((sum, v) => sum + v, 0);

  return {
    total,
    by_sender: counter,
  };
}

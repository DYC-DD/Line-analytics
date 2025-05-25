export function typeCountBySender(messages) {
  const result = {};
  const total = {};

  for (const msg of messages) {
    const sender = msg.sender;
    const type = msg.type || "text";

    if (!result[sender]) result[sender] = {};
    result[sender][type] = (result[sender][type] || 0) + 1;

    total[type] = (total[type] || 0) + 1;
  }

  result["總計"] = total;
  return result;
}

// dataProcessor.js
function Parsing(data) {
  const rows = data.split(/\r?\n/).map(row => {
    const parts = row.split(',');
    if (parts.length < 3) {
      return '';
    }
    const [date, user, message] = parts;
    return `${user},${message}`;
  });

  let totalMessageLength = 0;
  const maxTotalLength = 3000;
  const maxMessageLength = 300;

  const result = rows.map(row => {
    const [user, message] = row.split(',');
    if (!message) return '';
    let limitedMessage = message.substring(0, maxMessageLength);
    totalMessageLength += limitedMessage.length;

    if (totalMessageLength > maxTotalLength) {
      const remainingLength = maxTotalLength - (totalMessageLength - limitedMessage.length);
      limitedMessage = limitedMessage.substring(0, remainingLength);
    }

    return `${user},${limitedMessage}`;
  });

  return result.join('\n');
}

module.exports = { Parsing };

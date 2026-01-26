export function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomDate() {
  const now = new Date();
  const pastDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return new Date(pastDate.getTime() + Math.random() * (futureDate.getTime() - pastDate.getTime()));
}

export function formatDate(date, format = 'DD/MM/YY HH:mm') {
  if (!date){
    return '';
  }

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YY', year)
    .replace('HH', hours)
    .replace('mm', minutes);
}

export function formatDuration(startDate, endDate) {
  if (!startDate || !endDate){
    return '';
  }
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    const remainingHours = diffHours % 24;
    const remainingMins = diffMins % 60;
    return `${diffDays}D ${remainingHours}H ${remainingMins}M`;
  } else if (diffHours > 0) {
    const remainingMins = diffMins % 60;
    return `${diffHours}H ${remainingMins}M`;
  } else {
    return `${diffMins}M`;
  }
}

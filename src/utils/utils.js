import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { DateFormat } from '../constants/constants.js';

dayjs.extend(duration);

export function formatDate(date, format = DateFormat.DEFAULT) {
  if (!date){
    return '';
  }

  return dayjs(date).format(format);
}

export function formatDuration(startDate, endDate) {
  if (!startDate || !endDate){
    return '';
  }
  const diff = dayjs.duration(dayjs(endDate).diff(dayjs(startDate)));

  const days = diff.days();
  const hours = diff.hours();
  const minutes = diff.minutes();

  if (days > 0) {
    const formattedDays = days.toString().padStart(2, '0');
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedDays}D ${formattedHours}H ${formattedMinutes}M`;
  }

  if (hours > 0) {
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}H ${formattedMinutes}M`;
  }

  return `${minutes}M`;
}

export function generateAuthString(){
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

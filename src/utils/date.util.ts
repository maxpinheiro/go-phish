import { DateString } from '@/types/main';
import moment from 'moment-timezone';

export const formatDateRange = (dates: DateString[], withYear?: boolean): string => {
  if (dates.length === 0) return '';
  let dateObjs: Date[] = dates.map((date) => new Date(date.replaceAll('-', '/')));
  dateObjs.sort((a, b) => a.getTime() - b.getTime());
  let date1 = `${dateObjs[0].getMonth() + 1}/${dateObjs[0].getDate()}`;
  let date2 = `${dateObjs[dateObjs.length - 1].getMonth() + 1}/${dateObjs[dateObjs.length - 1].getDate()}`;
  if (withYear) {
    date1 += `/${dateObjs[0].getFullYear() % 100}`;
    date2 += `/${dateObjs[dateObjs.length - 1].getFullYear() % 100}`;
  }
  return dates.length === 1 ? date1 : `${date1} - ${date2}`;
};

export const compareDates = (date1: DateString, date2: DateString) => {
  const dateA = new Date(date1.replaceAll('-', '/'));
  const dateB = new Date(date2.replaceAll('-', '/'));
  return dateA < dateB;
};

export const isPastDate = (dateStr: DateString): boolean => {
  const date = new Date(dateStr.replaceAll('-', '/'));
  let now = new Date();
  now.setHours(0, 0, 0, 0);
  return date < now;
};

export const dateToString = (date: DateString): string => {
  return new Date(date.replaceAll('-', '/')).toDateString();
};

export const dateToDateString = (d: Date): DateString => {
  const date = moment(d).tz('UTC');
  return date.format('YYYY-MM-DD') as DateString;
  // const date = new Date(d);
  // return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const currentYear = (): number => {
  const date = new Date();
  return date.getFullYear();
};

export const getYearFromDate = (date: DateString, shortDate?: boolean): number => {
  const year = new Date(date.replaceAll('-', '/')).getFullYear();
  return shortDate ? year % 100 : year;
  /*const dateParsed = date.split('-');
    if (dateParsed.length < 3) return 0;
    else {
        const dateStr = dateParsed[0];
        const year = parseInt(dateStr);
        if (shortDate) {
            return year % 100;
        } else {
            if (dateStr.length === 4) return year;
            else if (dateStr.length === 2) return year <= currentYear() % 100 ? 2000 + year : 1900 + year;
            else return 0
        }
    }*/
};

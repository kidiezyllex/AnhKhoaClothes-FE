import dayjs from 'dayjs';
const regexPass = new RegExp(
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{6,}$/
);
const regexYoutube = new RegExp(
  /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/
);
const regexOnEmptyString = new RegExp(/^(?!\s*$).+$/);
const regexAllSpace = new RegExp(/\S/);
const regexMail = new RegExp(/^(?!.*\.com(.+)).*$/);
const regexTrimSpace=new RegExp(/^(?:[a-zA-Z0-9.\-_@]+)$/)
export const regex = {
  regexPass,
  regexYoutube,
  regexOnEmptyString,
  regexMail,
  regexAllSpace,
  regexTrimSpace
};
export const numericRegex = /[0-9]/;



export function convertToCustomDateFormat(dateString: string): string {
  return dayjs(dateString).format("DD/MM/YYYY");
}
export function convertToCustomDateStamp(dateString: string): string {
  return dayjs(dateString).format("YYYY-MM-DD");
}
export function convertToCustomDateVN(dateString: string): string {
  return dayjs(dateString).format("DD-MM-YYYY");
}
export function convertToCustomYearMonthDate(dateString: string): string {
  return dayjs(dateString).format("YYYY-MM-DD");
}
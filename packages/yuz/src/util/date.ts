

export function getNowDateList() {
  const now = new Date();
  const year = `${now.getFullYear()}`;
  let mon = `${now.getMonth() + 1}`;
  let date = `${now.getDate()}`;
  if (mon.length < 2) {
    mon = `0${mon}`;
  }
  if (date.length < 2) {
    date = `0${date}`;
  }
  return [
    year, mon, date,
  ]
}
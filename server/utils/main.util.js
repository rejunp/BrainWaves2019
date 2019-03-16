exports.getDateString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hours = date.getHours();
  const mins = date.getMinutes();
  return `${year}${month}${day}_${hours}${mins}`
}

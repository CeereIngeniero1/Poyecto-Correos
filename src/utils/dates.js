function isSameMonthDay(dateA, dateB) {
  return dateA.getMonth() === dateB.getMonth() && dateA.getDate() === dateB.getDate();
}

function isWomensDay(today = new Date()) {
  // 8 de marzo
  return today.getMonth() === 2 && today.getDate() === 8;
}

function isChristmas(today = new Date()) {
  // 25 de diciembre
  return today.getMonth() === 11 && today.getDate() === 25;
}

module.exports = { isSameMonthDay, isWomensDay, isChristmas };
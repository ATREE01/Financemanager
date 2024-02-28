const moment = require('moment-timezone');

const startDate = moment(`2024-01-01`, 'YYYY-MM-DD').endOf('week').add(0, 'week');
console.log(startDate);
console.log(moment().year(2023).week(52).endOf('week'))
console.log(moment().year(2024).week(0).endOf('week'))
console.log(moment("2024-01-01").week())
console.log(moment().week());
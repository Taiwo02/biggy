let date_ob = new Date();
let time = date_ob.toTimeString().substr(0, 5);
let fullDate = date_ob.toISOString().substr(0, 10)
var dates = {time:time,fullDate:fullDate}

module.exports = dates;
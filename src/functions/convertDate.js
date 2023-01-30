function convertDate(date) {
    let month = String(date.getMonth() + 1);
    let day = String(date.getDate());
    let year = String(date.getFullYear());
    let hours = String(date.getHours());
    let seconds = String(date.getSeconds())
    
  
    // store in Redux 
    return { month: month, day: day, year: year, hours: hours, seconds: seconds};
  }

module.exports = {convertDate}
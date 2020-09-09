
export.getDate=function() {
  const day = new Date();
  let myDay = day.getDay();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  }
  let today = day.toLocaleDateString("en-US", options);
  return today
}
//For requiring:const<varName>=require(__dirname+"date.js")

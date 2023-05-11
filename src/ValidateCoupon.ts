export function ValidateCoupon(date: any) {
  var today = new Date();
  return date > today ? true : false;
}

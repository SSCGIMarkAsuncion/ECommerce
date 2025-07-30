export function toCurrency(num: number) {
  return num.toLocaleString("en-ph", {
    style: "currency",
    currency: "PHP"
  });
}
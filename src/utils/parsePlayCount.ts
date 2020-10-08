export default function (playCount: number) {
  return parseInt(`${playCount / 10000}`) + "万";
}

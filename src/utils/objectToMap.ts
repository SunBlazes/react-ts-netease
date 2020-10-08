export default function objectToMap(obj: any) {
  const map = new Map();
  for (let key in obj) {
    map.set(key, obj[key]);
  }
  return map;
}

export default function mapToObject<V>(map: Map<string, V>) {
  const obj: any = {};
  for (let [key, value] of map.entries()) {
    obj[key] = value;
  }
  return obj;
}

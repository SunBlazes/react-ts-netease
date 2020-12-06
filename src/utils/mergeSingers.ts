export default function (singers: Array<any>) {
  const arr: Array<ISingerInfo> = [];
  for (let i = 0; i < singers.length; i++) {
    const singer = singers[i];
    arr.push({
      name: singer.name,
      id: singer.id
    });
  }
  return arr;
}

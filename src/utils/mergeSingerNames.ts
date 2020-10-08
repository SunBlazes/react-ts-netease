export default function (singers: Array<any>) {
  const arr: Array<string> = [];
  for (let i = 0; i < singers.length; i++) {
    const name = singers[i].name as string;
    arr.push(name);
  }
  return arr.join("/");
}

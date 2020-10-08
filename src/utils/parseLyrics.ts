const reg = /^\[(?<minute>\d+):(?<second>\d+\.\d+)\](?<content>.*)?$/gm;

export default function (str: string) {
  let res: RegExpExecArray | null;
  let arr: Array<LyricRegItem> = [];
  while ((res = reg.exec(str))) {
    let data: any = res.groups;
    let minute = parseFloat(data.minute);
    let second = parseFloat(data.second) + minute * 60;
    let content = data.content;
    if (content && content.length > 0) {
      content = content.trim();
      arr.push({
        second,
        content
      });
    } else {
      arr.push({
        second,
        content: ""
      });
    }
  }
  return arr;
}

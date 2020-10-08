type PLayMode = "order" | "random" | "repeat";

type PlayModeTitle = "顺序播放" | "随机播放" | "单曲循环";

type PlayModeIcon =
  | "icon-shouye-bofangmoshi-shunxubofang"
  | "icon-shouye-bofangmoshi-suijibofang"
  | "icon-shouye-bofangmoshi-danquxunhuan";

interface PlayerProps {
  src?: string;
  currIndex: number;
  playQueue: Array<string>;
  changePlayId: (index: number) => void;
  playUrlMap: Map<string, string>;
  fetchPlayUrl: (id: string) => void;
  changePlayState: (flag: boolean) => void;
}

interface IPlayMode {
  playMode: PLayMode;
  title: PlayModeTitle;
  icon: PlayModeIcon;
  index: number;
}

interface SingerDetailProps {
  id: string;
  show: boolean;
}

interface SingerAlbumProps {
  id: string;
  show: boolean;
}

interface SingerAlbumDetailProps {
  id: string;
  currIndex: number;
  playQueue: string[];
  playState: boolean;
  title: string;
  needExpand?: boolean;
  top50: boolean;
  picUrl?: string;
  setPlayDetailMap: (map: Map<string, PlayDetailItem>) => void;
  pushPlayQueue: (ids: string | Array<string>) => void;
  fetchPlayUrl: (id: string) => void;
  changePlayIndex: (id: string) => void;
}

interface ISingerAlbumItem {
  index: string;
  id: string;
  name: string;
  alia?: string;
  duration: string;
  hasCopyRight: boolean;
}

interface SingerAlbumItemProps extends ISingerAlbumItem {
  handleItemClick: () => void;
  selected: boolean;
  isPlayed: boolean;
  playState: boolean;
  onDbClick: () => void;
}

interface IAlbumInfo {
  id: string;
  title: string;
  picUrl: string;
}

interface SingerInfoProps {
  id: string;
  show: boolean;
}

interface ISingerDesc {
  title: string;
  content: string;
}

interface SingerMVProps {
  id: string;
  show: boolean;
  changeShow: (currType: showOfType) => void;
}

interface ISingerMVItem {
  id: string;
  name: string;
  picUrl: string;
  duration: string;
  playCount: string;
}

interface SingerMVItemProps extends ISingerMVItem {
  onClick: () => void;
}

interface SimiSingersProps {
  id: string;
  show: boolean;
}

interface ISimiSingerItem {
  picUrl: string;
  id: string;
  name: string;
}

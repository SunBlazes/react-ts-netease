interface ResultOfSongsProps {
  keywords: string;
  setSearchCount: (num: number) => void;
  setLoading: (flag: boolean) => void;
  current: string;
  playState: boolean;
  setPlayDetailMap: (map: Map<string, PlayDetailItem>) => void;
  pushPlayQueue: (ids: string) => void;
  fetchPlayUrl: (id: string) => void;
  changePlayIndex: (id: string) => void;
  changePlayState: (flag: boolean) => void;
  playQueue: string[];
  urlMap: Map<string, string>;
}

interface ISearchOfSongItem extends PlayDetailItem {
  pop: number;
  index: string;
}

interface ResultOfSingersProps {
  keywords: string;
  setSearchCount: (num: number) => void;
  setLoading: (flag: boolean) => void;
}

interface ISearchOfSingerItem {
  picUrl: string;
  name: string;
  id: string;
}

interface ResultOfAlbumsProps {
  keywords: string;
  setSearchCount: (num: number) => void;
  setLoading: (flag: boolean) => void;
}

interface ISearchOfAlbumItem {
  id: string;
  name: string;
  singerName: string;
  picUrl: string;
  singerId: string;
}

interface ResultOfMVsProps {
  keywords: string;
  setSearchCount: (num: number) => void;
  setLoading: (flag: boolean) => void;
}

interface ISearchOfMVItem {
  playCount: string;
  duration: string;
  name: string;
  singers: ISingerInfo[];
  id: string;
  picUrl: string;
}

interface ResultOfPlaylistsProps {
  keywords: string;
  setSearchCount: (num: number) => void;
  setLoading: (flag: boolean) => void;
}

interface ResultOfPlaylistItem {
  picUrl: string;
  name: string;
  total: string;
  creatorName: string;
  id: string;
}

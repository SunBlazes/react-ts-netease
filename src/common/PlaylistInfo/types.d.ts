interface SongSheetProps extends ISongSheet {
  keywords: string;
  show: boolean;
  clickAndPushAll?: boolean;
  setPlayDetailMap: (map: Map<string, PlayDetailItem>) => void;
  pushPlayQueue: (ids: string | Array<string>, playlistId: string) => void;
  fetchPlayUrl: (id: string) => void;
  changePlayIndex: (id: string) => void;
  current: string;
  playState: boolean;
  willPlaylistId: string[];
}

interface ISingerInfo {
  name: string;
  id: string;
}

interface ISongSheetItem {
  name: string;
  singers: ISingerInfo[];
  album: string;
  duration: string;
  index: string;
  id: string;
  picUrl: string;
  hasCopyRight: boolean;
  albumId: string;
}

interface ISongSheet {
  trackIds: Array<string>;
}

interface ISubscriber {
  avatarUrl: string;
  userId: string | number;
}

interface ISubscribers {
  subscribers: Array<ISubscriber>;
}

interface PlaylistInfoProps extends ISongSheet, ISubscribers {
  playlistId: string;
}

interface WillPlayListProps {
  show: boolean;
}

interface WillPlayTableProps {
  willPlayQueue: Array<WillPlayItem>;
  fetchPlayUrl: (id: string) => void;
  changePlayIndex: (id: string) => void;
  current: string;
  playState: boolean;
  pushPlayQueue: (ids: string | Array<string>) => void;
}

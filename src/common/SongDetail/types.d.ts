interface SongDetailProps {
  current: number;
  songDetail?: PlayDetailItem;
  changeShow: (currType: showOfType) => void;
}

interface SongDetailContent {
  show: boolean;
  playState: boolean;
  songDetail: PlayDetailItem;
  lyricStr?: string;
  fetchPlayLyric: (id: string) => void;
  changeShow: (currType: showOfType) => void;
}

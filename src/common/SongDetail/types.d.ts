interface SongDetailProps {
  current: number;
  songDetail?: PlayDetailItem;
}

interface SongDetailContent {
  show: boolean;
  playState: boolean;
  songDetail: PlayDetailItem;
  lyricStr?: string;
  fetchPlayLyric: (id: string) => void;
}

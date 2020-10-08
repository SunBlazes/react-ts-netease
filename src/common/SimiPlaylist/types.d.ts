interface SimiPlaylistProps {
  id: string;
  onClick: (id: string) => void;
}

interface ISimiPlaylistItem {
  playCount: number;
  name: string;
  picUrl: string;
  id: string;
  onClick?: (id: string) => void;
}

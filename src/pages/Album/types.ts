export interface AlbumSongsProps {
  songs: IAlbumSongItem[];
  loading: boolean;
  current: string;
  playState: boolean;
  pushPlayQueue: (ids: string | Array<string>, playlistId: string) => void;
  fetchPlayUrl: (id: string) => void;
  changePlayIndex: (id: string) => void;
  willPlaylistId: string[];
}

export type currentType = "songs" | "comments" | "albumInfo";

export interface AlbumInfo {
  picUrl: string;
  description: string;
  name: string;
  artistName: string;
  publishTime: number;
  shareCount: number;
  id: string;
}

export interface IAlbumSongItem extends PlayDetailItem {
  pop: number;
  index: string;
}

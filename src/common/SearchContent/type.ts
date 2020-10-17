export interface IIArtistItem {
  name: string;
  id: string;
}

export interface IISongItem {
  name: string;
  singerName: string;
  id: string;
}

export interface IIAlbumItem {
  name: string;
  singerName: string;
  id: string;
}

export interface IIPlaylistItem {
  name: string;
  id: string;
}

export interface ISearchSuggestions {
  artists: IIArtistItem[];
  albums: IIAlbumItem[];
  songs: IISongItem[];
  playlists: IIPlaylistItem[];
}

declare interface UserProps {
  avatarUrl: string;
  nickname: string;
  userId: string;
}

declare interface HeaderStoreStateProps {
  userState: boolean;
  user: UserProps;
}

declare interface SignInStoreStateProps {
  show: boolean;
}

declare interface CommentsStoreStateProps {
  id: string;
  type: commentType;
}

type showOfType =
  | "playlist"
  | "songDetailContent"
  | "moreComments"
  | "comments"
  | "moreComments"
  | "recommend"
  | "totalPlaylist"
  | "rank"
  | "singer"
  | "singerRank"
  | "songDetailContent"
  | "singerDetail"
  | "mv"
  | "searchResult"
  | "album";

declare interface ShowOfTypeLinkedItem {
  currType: showOfType;
  prev?: ShowOfTypeLinkedItem;
  next?: ShowOfTypeLinkedItem;
  id?: number;
}

declare interface HomeStoreStateProps {
  showMap: Map<showOfType, boolean>;
  currLinkedItem: ShowOfTypeLinkedItem;
}

declare interface PlayDetailItem {
  name: string;
  singerName: string;
  album: string;
  duration: string;
  id: string;
  picUrl: string;
  hasCopyRight: boolean;
  alia: string;
}

declare interface WillPlayItem {
  name: string;
  singerName: string;
  duration: string;
  id: string;
}

declare interface PlayerStoreStateProps {
  playQueue: Array<string>;
  playUrlMap: Map<string, string>;
  playLyricMap: Map<string, string>;
  playDetailMap: Map<string, PlayDetailItem>;
  current: number;
  playState: boolean;
  willPlayQueue: Array<WillPlayItem>;
  willplaylistId: Array<string>;
}

declare interface LoginRequestConfig {
  phone: string | number;
  password: string;
}

declare interface Window {
  audio: HTMLAudioElement;
}

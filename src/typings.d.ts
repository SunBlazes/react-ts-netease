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

declare interface PlayDetailItem {
  name: string;
  singers: ISingerInfo[];
  album: string;
  duration: string;
  id: string;
  picUrl: string;
  hasCopyRight: boolean;
  alia: string;
  albumId: string;
}

declare interface WillPlayItem {
  name: string;
  singers: ISingerInfo[];
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

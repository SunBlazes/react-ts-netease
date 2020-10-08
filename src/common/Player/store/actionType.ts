export const PUSH_PLAY_QUEUE = "push_play_queue";
type PUSH_PLAY_QUEUE_TYPE = typeof PUSH_PLAY_QUEUE;

export const SET_PLAY_URL_MAP = "set_play_url_map";
type SET_PLAY_URL_MAP_TYPE = typeof SET_PLAY_URL_MAP;

export const SET_PLAY_LYRIC_MAP = "set_play_lyric_map";
type SET_PLAY_LYRIC_MAP_TYPE = typeof SET_PLAY_LYRIC_MAP;

export const SET_PLAY_DETAIL_MAP = "set_play_detail_map";
type SET_PLAY_DETAIL_MAP_TYPE = typeof SET_PLAY_DETAIL_MAP;

export const CHANGE_PLAY_INDEX = "change_play_index";
type CHANGE_PLAY_INDEX_TYPE = typeof CHANGE_PLAY_INDEX;

export const CHANGE_PLAY_ID = "change_play_id";
type CHANGE_PLAY_ID_TYPE = typeof CHANGE_PLAY_ID;

export const CHNAGE_PLAY_STATE = "change_play_state";
type CHNAGE_PLAY_STATE_TYPE = typeof CHNAGE_PLAY_STATE;

export interface PushPlayQueueType {
  type: PUSH_PLAY_QUEUE_TYPE;
  id: string | Array<string>;
  shouldCover: boolean;
}

export interface SetPlayUrlMapType {
  type: SET_PLAY_URL_MAP_TYPE;
  url: string;
  id: string;
}

export interface SetPlayLyricMapType {
  type: SET_PLAY_LYRIC_MAP_TYPE;
  lyric: string;
  id: string;
}

export interface SetPlayDetailMapType {
  type: SET_PLAY_DETAIL_MAP_TYPE;
  items: Map<string, PlayDetailItem>;
}

export interface ChangePlayIndexType {
  type: CHANGE_PLAY_INDEX_TYPE;
  id: string;
}

export interface ChangePlayStateType {
  type: CHNAGE_PLAY_STATE_TYPE;
  flag: boolean;
}

export interface ChangePlayIdType {
  type: CHANGE_PLAY_ID_TYPE;
  index: number;
}

export type PlayerActionType =
  | PushPlayQueueType
  | SetPlayUrlMapType
  | SetPlayLyricMapType
  | SetPlayDetailMapType
  | ChangePlayIndexType
  | ChangePlayIdType
  | ChangePlayStateType;

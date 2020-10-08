import {
  PlayerActionType,
  PUSH_PLAY_QUEUE,
  SET_PLAY_DETAIL_MAP,
  SET_PLAY_LYRIC_MAP,
  SET_PLAY_URL_MAP,
  CHANGE_PLAY_INDEX,
  CHANGE_PLAY_ID,
  CHNAGE_PLAY_STATE
} from "./actionType";
import axios from "../../../network";
// import { parseTime, mergeSingerNames } from "../../../utils";

export const getPushPlayQueueAction = (
  id: string | Array<string>,
  shouldCover = false
): PlayerActionType => {
  return {
    type: PUSH_PLAY_QUEUE,
    id,
    shouldCover
  };
};

export const getSetPlayUrlMapAction = (
  url: string,
  id: string
): PlayerActionType => {
  return {
    type: SET_PLAY_URL_MAP,
    url,
    id
  };
};

export const getSetPlayLyricMapAction = (
  lyric: string,
  id: string
): PlayerActionType => {
  return {
    type: SET_PLAY_LYRIC_MAP,
    lyric,
    id
  };
};

export const getSetPlayDetailMapAction = (
  items: Map<string, PlayDetailItem>
): PlayerActionType => {
  return {
    type: SET_PLAY_DETAIL_MAP,
    items
  };
};

export const getChangePlayIndexAction = (id: string): PlayerActionType => {
  return {
    type: CHANGE_PLAY_INDEX,
    id
  };
};

export const getChangePlayStateAction = (flag: boolean): PlayerActionType => {
  return {
    type: CHNAGE_PLAY_STATE,
    flag
  };
};

export const getChangePlayIdAction = (index: number): PlayerActionType => {
  return {
    type: CHANGE_PLAY_ID,
    index
  };
};

export const fetchPlayUrl = (id: string) => {
  return async (dispatch: any) => {
    const queryUrl = `/song/url?id=${id}`;
    try {
      let { data } = await axios.get(queryUrl);
      const _data = data.data as Array<any>;
      _data.length !== 0 && dispatch(getSetPlayUrlMapAction(_data[0].url, id));
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchPlayLyric = (id: string) => {
  return async (dispatch: any) => {
    const queryLyric = `/lyric?id=${id}`;
    try {
      let { data } = await axios.get(queryLyric);
      dispatch(getSetPlayLyricMapAction(data.lrc.lyric, id));
    } catch (error) {
      console.log(error);
    }
  };
};

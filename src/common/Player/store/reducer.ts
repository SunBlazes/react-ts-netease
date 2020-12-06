import { PlayerActionType, CHNAGE_PLAY_STATE } from "./actionType";
import {
  SET_PLAY_URL_MAP,
  PUSH_PLAY_QUEUE,
  SET_PLAY_LYRIC_MAP,
  SET_PLAY_DETAIL_MAP,
  CHANGE_PLAY_INDEX,
  CHANGE_PLAY_ID
} from "./actionType";

const defaultState: PlayerStoreStateProps = {
  playLyricMap: new Map<string, string>(),
  playDetailMap: new Map<string, PlayDetailItem>(),
  playUrlMap: new Map<string, string>(),
  playQueue: [],
  current: -1,
  playState: false,
  willPlayQueue: [],
  willplaylistId: []
};

function clone(state: PlayerStoreStateProps) {
  let playDetailMap = new Map(state.playDetailMap);
  let playUrlMap = new Map(state.playUrlMap);
  let playLyricMap = new Map(state.playLyricMap);
  const newState = JSON.parse(JSON.stringify(state)) as PlayerStoreStateProps;
  newState.playLyricMap = playLyricMap;
  newState.playUrlMap = playUrlMap;
  newState.playDetailMap = playDetailMap;
  return newState;
}

export default (state = defaultState, action: PlayerActionType) => {
  switch (action.type) {
    case PUSH_PLAY_QUEUE: {
      const { id, shouldCover, playlistId } = action;
      const newState = clone(state);
      if (shouldCover) {
        newState.playQueue = [];
        newState.willPlayQueue = [];
        if (playlistId) {
          newState.willplaylistId = [playlistId];
        }
        newState.willplaylistId = [];
      }
      if (id instanceof Array) {
        if (id.length === 0) {
          window.audio.pause();
          window.audio.src = "";
          newState.current = -1;
          newState.playState = false;
        }
        newState.playQueue.push(...id);
        for (let i = 0; i < id.length; i++) {
          const item = newState.playDetailMap.get(id[i]);
          if (item) {
            const { name, singers, duration, id } = item;
            newState.willPlayQueue.push({
              name,
              singers,
              duration,
              id
            });
          }
        }
      } else {
        newState.playQueue.splice(newState.current + 1, 0, id);
        const item = newState.playDetailMap.get(id);
        if (item) {
          const { name, singers, duration, id } = item;
          newState.willPlayQueue.splice(newState.current + 1, 0, {
            name,
            singers,
            duration,
            id
          });
        }
      }
      // console.log(newState);
      return newState;
    }
    case SET_PLAY_URL_MAP: {
      const { url, id } = action;
      const newState = clone(state);
      newState.playUrlMap.set(id, url);
      return newState;
    }
    case SET_PLAY_LYRIC_MAP: {
      const { lyric, id } = action;
      const newState = clone(state);
      newState.playLyricMap.set(id, lyric);
      return newState;
    }
    case SET_PLAY_DETAIL_MAP: {
      const { items } = action;
      const newState = clone(state);
      newState.playDetailMap = new Map([...newState.playDetailMap, ...items]);
      return newState;
    }
    case CHANGE_PLAY_INDEX: {
      const { id } = action;
      const newState = clone(state);
      newState.current = newState.playQueue.indexOf(id);
      return newState;
    }
    case CHANGE_PLAY_ID: {
      const { index } = action;
      const newState = clone(state);
      console.log(index);
      newState.current = index;
      return newState;
    }
    case CHNAGE_PLAY_STATE: {
      const { flag } = action;
      const newState = clone(state);
      newState.playState = flag;
      return newState;
    }
    default:
      return state;
  }
};

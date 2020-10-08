import {
  getChangePlayIdAction,
  fetchPlayUrl,
  getChangePlayStateAction
} from "./store";
import { UnionStateTypes } from "../../store";

export const mapStateToProps = (
  state: UnionStateTypes
): {
  src: string | undefined;
  currIndex: number;
  playQueue: Array<string>;
  playUrlMap: Map<string, string>;
} => {
  const player = state.player;
  const currIndex = player.current;
  const playQueue = player.playQueue;
  const current = playQueue[currIndex];

  return {
    src: player.playUrlMap.get(current),
    currIndex: currIndex,
    playQueue,
    playUrlMap: player.playUrlMap
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return {
    changePlayId(index: number) {
      console.log(index);
      dispatch(getChangePlayIdAction(index));
    },
    fetchPlayUrl(id: string) {
      dispatch(fetchPlayUrl(id));
    },
    changePlayState(flag: boolean) {
      dispatch(getChangePlayStateAction(flag));
    }
  };
};

import * as types from "./actionType";

const defaultState: HomeStoreStateProps = {
  showMap: new Map<showOfType, boolean>([
    ["playlist", false],
    ["songDetailContent", false],
    ["moreComments", false],
    ["comments", false],
    ["recommend", true],
    ["totalPlaylist", false],
    ["rank", false],
    ["singer", false],
    ["singerRank", false],
    ["songDetailContent", false],
    ["singerDetail", false],
    ["mv", false],
    ["searchResult", false],
    ["album", false]
  ]),
  currLinkedItem: {
    currType: "recommend"
  }
};

function clone(state: HomeStoreStateProps) {
  const showMap = state.showMap;
  const newState: HomeStoreStateProps = JSON.parse(JSON.stringify(state));
  newState.showMap = new Map(showMap);
  return newState;
}

export default (state = defaultState, action: types.HomeActionTypes) => {
  switch (action.type) {
    case types.CHNAGE_TYPE_SHOW: {
      if (state.showMap.get(action.showType)) {
        return state;
      }
      const newState = clone(state);
      const prevItem = newState.currLinkedItem;
      const prevType = prevItem.currType; // 之前显示的
      const currType = action.showType; // 即将显示的
      newState.showMap.set(currType, true);
      newState.showMap.set(prevType, false); //隐藏之前的
      const currLinkedItem: ShowOfTypeLinkedItem = {
        prev: prevItem,
        currType: action.showType
      };
      newState.currLinkedItem = currLinkedItem;
      return newState;
    }
    case types.TOGGLE_TYPE_SHOW: {
      const newState = clone(state);
      const diretion = action.direction;
      const currItem = newState.currLinkedItem;
      const currType = currItem.currType;
      if (diretion === "prev") {
        const prevItem = newState.currLinkedItem.prev as ShowOfTypeLinkedItem;
        currItem.prev = undefined;
        prevItem.next = currItem;
        newState.currLinkedItem = prevItem;
      } else {
        const nextItem = newState.currLinkedItem.next as ShowOfTypeLinkedItem;
        currItem.next = undefined;
        nextItem.prev = currItem;
        newState.currLinkedItem = nextItem;
      }
      if (currType !== newState.currLinkedItem.currType) {
        newState.showMap.set(newState.currLinkedItem.currType, true);
        newState.showMap.set(currType, false);
      }
      return newState;
    }
    case types.REMOVE_TYPE_SHOW: {
      const type = action.showType;
      const newState = clone(state);
      const currLinkedItem = newState.currLinkedItem;

      if (currLinkedItem.currType === type) {
        const prev = currLinkedItem.prev as ShowOfTypeLinkedItem;
        prev.next = currLinkedItem.next;
        newState.currLinkedItem = prev;
      }

      let currItem = newState.currLinkedItem;
      while (currItem.prev) {
        const prev = currItem.prev;
        if (prev.currType === type) {
          if (prev.prev) {
            const prev1 = prev.prev;
            prev1.next = prev.next;
            currItem.prev = prev1;
            currItem = prev1;
          } else {
            currItem.prev = undefined;
          }
        } else {
          currItem = prev;
        }
      }

      while (currItem.next) {
        const next = currItem.next;
        if (next.currType === type) {
          if (next.next) {
            const next1 = next.next;
            next1.prev = next.prev;
            currItem.next = next1;
            currItem = next1;
          } else {
            currItem.next = undefined;
          }
        } else {
          currItem = next;
        }
      }

      newState.showMap.set(type, false);
      newState.showMap.set(newState.currLinkedItem.currType, true);

      console.log(newState);
      return newState;
    }
    default:
      return state;
  }
};

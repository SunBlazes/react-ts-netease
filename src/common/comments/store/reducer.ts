import { CommentsActionType, SET_MORE_COMMENTS_ATTR } from "./actionType";

const defaultState: CommentsStoreStateProps = {
  type: "playlist",
  id: ""
};

export default (state = defaultState, action: CommentsActionType) => {
  switch (action.type) {
    case SET_MORE_COMMENTS_ATTR: {
      const newState: CommentsStoreStateProps = JSON.parse(
        JSON.stringify(state)
      );
      newState.id = action.attr.id;
      newState.type = action.attr.type;
      return newState;
    }
    default:
      return state;
  }
};

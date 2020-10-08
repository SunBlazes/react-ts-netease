import { CommentsActionType, SET_MORE_COMMENTS_ATTR } from "./actionType";

export const getSetMoreCommentsAttrAction = (
  attr: MoreCommentsAttrType
): CommentsActionType => {
  return {
    type: SET_MORE_COMMENTS_ATTR,
    attr
  };
};

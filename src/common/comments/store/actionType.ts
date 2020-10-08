export const SET_MORE_COMMENTS_ATTR = "set_more_comments_attr";
type SET_MORE_COMMENTS_ATTR_TYPE = typeof SET_MORE_COMMENTS_ATTR;

export const CHNAGE_MORE_COMMENTS_SHOW = "change_more_comments_show";
type CHNAGE_MORE_COMMENTS_SHOW_TYPE = typeof CHNAGE_MORE_COMMENTS_SHOW;

interface SetMoreCommentsAttrType {
  type: SET_MORE_COMMENTS_ATTR_TYPE;
  attr: MoreCommentsAttrType;
}

export type CommentsActionType = SetMoreCommentsAttrType;

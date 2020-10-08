export const SET_USER_INFO = "set_user_info";
type SET_USER_INFO_TYPE = typeof SET_USER_INFO;

export const UPDATE_USER_STATE = "update_user_state";
type UPDATE_USER_STATE_TYPE = typeof UPDATE_USER_STATE;

export interface SetUserInfoType {
  type: SET_USER_INFO_TYPE;
  user: UserProps;
}

export interface UpdateUserStateType {
  type: UPDATE_USER_STATE_TYPE;
  state: boolean;
}

export type HeaderActionType = SetUserInfoType | UpdateUserStateType;

import { HeaderActionType } from "./actionType";
import { SET_USER_INFO, UPDATE_USER_STATE, USER_LOG_OUT } from "./actionType";

const defaultState: HeaderStoreStateProps = {
  userState: false,
  user: {
    avatarUrl: "",
    nickname: "",
    userId: ""
  }
};

function reset(state: HeaderStoreStateProps) {
  state.userState = false;
  state.user.avatarUrl = "";
  state.user.nickname = "";
  state.user.userId = "";
  return state;
}

const HeaderReducer = (state = defaultState, action: HeaderActionType) => {
  switch (action.type) {
    case SET_USER_INFO: {
      const newState: HeaderStoreStateProps = JSON.parse(JSON.stringify(state));
      newState.user = action.user;
      return newState;
    }
    case UPDATE_USER_STATE: {
      const newState: HeaderStoreStateProps = JSON.parse(JSON.stringify(state));
      newState.userState = action.state;
      return newState;
    }
    case USER_LOG_OUT: {
      const newState: HeaderStoreStateProps = JSON.parse(JSON.stringify(state));
      return reset(newState);
    }
    default:
      return state;
  }
};

export default HeaderReducer;

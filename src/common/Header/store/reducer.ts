import { HeaderActionType } from "./actionType";
import { SET_USER_INFO, UPDATE_USER_STATE } from "./actionType";

const defaultState: HeaderStoreStateProps = {
  userState: false,
  user: {
    avatarUrl: "",
    nickname: "",
    userId: ""
  }
};

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
    default:
      return state;
  }
};

export default HeaderReducer;

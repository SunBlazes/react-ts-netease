const defaultState: SignInStoreStateProps = {
  show: false
};

export const CHANGE_SIGNIN_SHOW = "change_signIn_show";
type CHANGE_SIGNIN_SHOW_TYPE = typeof CHANGE_SIGNIN_SHOW;

export interface ChangeSignInShowType {
  type: CHANGE_SIGNIN_SHOW_TYPE;
  show: boolean;
}

export default (state = defaultState, action: ChangeSignInShowType) => {
  switch (action.type) {
    case CHANGE_SIGNIN_SHOW: {
      const newState: SignInStoreStateProps = JSON.parse(JSON.stringify(state));
      newState.show = action.show;
      return newState;
    }
    default:
      return state;
  }
};

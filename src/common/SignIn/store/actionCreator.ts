import { ChangeSignInShowType, CHANGE_SIGNIN_SHOW } from "./reducer";

export const getChangeSignInShowAction = (
  show: boolean
): ChangeSignInShowType => {
  return {
    type: CHANGE_SIGNIN_SHOW,
    show
  };
};

import {
  HeaderActionType,
  SET_USER_INFO,
  UPDATE_USER_STATE
} from "./actionType";
import axios from "../../../network";
import { Dispatch } from "redux";
import { message } from "antd";
import { getChangeSignInShowAction } from "../../SignIn/store/actionCreator";

export const getSetUserInfoAction = (user: UserProps): HeaderActionType => {
  return {
    type: SET_USER_INFO,
    user
  };
};

export const getUpdateUserStateAction = (state: boolean): HeaderActionType => {
  return {
    type: UPDATE_USER_STATE,
    state
  };
};

export const userLogIn = (
  params: LoginRequestConfig
): ((dispatch: Dispatch) => void) => {
  return (dispatch) => {
    message.loading({
      content: "登陆中",
      duration: 0,
      key: "loading"
    });
    const { phone, password } = params;
    const querystring = `/login/cellphone?phone=${phone}&password=${password}`;
    axios
      .get(querystring)
      .then((res) => {
        message.destroy();
        let { data } = res;
        const user = {} as UserProps;
        const { avatarUrl, nickname, userId } = data.profile;
        user.avatarUrl = avatarUrl;
        user.nickname = nickname;
        user.userId = userId;
        dispatch(getUpdateUserStateAction(true));
        dispatch(getSetUserInfoAction(user));
        message.success({
          content: "登录成功",
          onClose: () => dispatch(getChangeSignInShowAction(false))
        });
      })
      .catch(() => {
        message.destroy();
        message.error("账号或密码错误");
      });
  };
};

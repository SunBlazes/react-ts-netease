import React, { useContext, useState } from "react";
import { Popconfirm } from "antd";
import SearchInput from "../SearchInput";
import { UserOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { UnionStateTypes } from "../../store";
import { getChangeSignInShowAction } from "../SignIn/store/actionCreator";
import { HistoryStackProps } from "../../pages/Home";
import { useHistory } from "react-router-dom";
import { SetHistoryStackContext } from "../../pages/Home";
import { getUserLogOutAction } from "./store/actionCreator";
import { useAliveController } from "react-activation";

interface HeaderProps extends HeaderStoreStateProps {
  changeSignInShow: (flag: boolean) => void;
  historyStack: HistoryStackProps;
  handleUserLogOut: () => void;
}

const Header: React.FC<HeaderProps> = (props) => {
  const {
    userState,
    user,
    changeSignInShow,
    historyStack,
    handleUserLogOut
  } = props;
  const { nickname, avatarUrl } = user;
  const history = useHistory();
  const context = useContext(SetHistoryStackContext);
  const [visible, setVisible] = useState(false);
  const { dropScope } = useAliveController();

  function enterLogin() {
    if (!userState) {
      return changeSignInShow(true);
    }
    setVisible(!visible);
  }

  function handlePrevClick() {
    if (!historyStack.prev) return;
    context.setHistoryStack("prev", "");
    history.goBack();
  }

  function handleNextClick() {
    if (!historyStack.next) return;
    context.setHistoryStack("next", "");
    history.goForward();
  }

  function handleOk() {
    handleUserLogOut();
    history.replace("/");
    context.setHistoryStack("clear", "");
    dropScope(/^((?!recommend).)*$/);
  }

  return (
    <div className="header">
      <div className="header-inner">
        <a href="/" className="logo" onClick={(e) => e.preventDefault()}>
          <span className=" iconfont icon-wangyiyunyinyueclick"></span>
          <span className="name">网易云音乐</span>
        </a>
        <div className="navigators">
          <div
            className={`navigator-prev ${historyStack.prev ? "able" : ""}`}
            onClick={handlePrevClick}
          >
            <LeftOutlined />
          </div>
          <div
            className={`navigator-next ${historyStack.next ? "able" : ""}`}
            onClick={handleNextClick}
          >
            <RightOutlined />
          </div>
        </div>
        <SearchInput
          style={{ float: "left", marginLeft: "4rem" }}
          placeholder="搜索音乐,歌手,歌词,用户"
          onSearch={(keywords: string) => {
            context.setHistoryStack("push", "searchResult");
            history.push(`/searchResult/${keywords}`);
          }}
        />
        <div className="user" onClick={enterLogin}>
          <span className="user-img">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" />
            ) : (
              <UserOutlined className="user-icon" />
            )}
          </span>
          {userState ? (
            <span className="user-state user-online">{nickname}</span>
          ) : (
            <span className="user-state user-offline">未登录</span>
          )}
          <Popconfirm
            visible={visible}
            title="确定退出吗"
            cancelText="取消"
            okText="退出"
            onConfirm={handleOk}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = function (state: UnionStateTypes) {
  const header = state.header;
  return {
    user: header.user,
    userState: header.userState
  };
};

const mapDispatchToProps = function (dispatch: any) {
  return {
    changeSignInShow(flag: boolean) {
      const action = getChangeSignInShowAction(flag);
      dispatch(action);
    },
    handleUserLogOut() {
      const action = getUserLogOutAction();
      dispatch(action);
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Header));

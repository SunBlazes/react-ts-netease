import React from "react";
import SearchInput from "../SearchInput";
import { UserOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { UnionStateTypes } from "../../store";
import { getChangeSignInShowAction } from "../SignIn/store/actionCreator";
import {
  getToggleTypeShowAction,
  direction,
  getChangeTypeShowAction
} from "../../pages/Home/store";

interface HeaderProps extends HeaderStoreStateProps {
  changeSignInShow: (flag: boolean) => void;
  currLinkedItem: ShowOfTypeLinkedItem;
  toggleTypeShow: (direction: direction) => void;
  changeTypeShow: (type: showOfType) => void;
}

const Header: React.FC<HeaderProps> = (props) => {
  const {
    userState,
    user,
    changeSignInShow,
    currLinkedItem,
    toggleTypeShow,
    changeTypeShow
  } = props;
  const { nickname, avatarUrl } = user;

  function enterLogin() {
    if (!userState) {
      changeSignInShow(true);
    }
  }

  function handlePrevClick() {
    if (currLinkedItem.prev) {
      toggleTypeShow("prev");
    }
  }

  function handleNextClick() {
    if (currLinkedItem.next) {
      toggleTypeShow("next");
    }
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
            className={`navigator-prev ${currLinkedItem.prev ? "able" : ""}`}
            onClick={handlePrevClick}
          >
            <LeftOutlined />
          </div>
          <div
            className={`navigator-next ${currLinkedItem.next ? "able" : ""}`}
            onClick={handleNextClick}
          >
            <RightOutlined />
          </div>
        </div>
        <SearchInput
          style={{ float: "left", marginLeft: "4rem" }}
          placeholder="搜索音乐,歌手,歌词,用户"
          onSearch={() => changeTypeShow("searchResult")}
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
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = function (state: UnionStateTypes) {
  const header = state.header;
  const home = state.home;
  return {
    user: header.user,
    userState: header.userState,
    currLinkedItem: home.currLinkedItem
  };
};

const mapDispatchToProps = function (dispatch: any) {
  return {
    changeSignInShow(flag: boolean) {
      const action = getChangeSignInShowAction(flag);
      dispatch(action);
    },
    toggleTypeShow(direction: direction) {
      dispatch(getToggleTypeShowAction(direction));
    },
    changeTypeShow(type: showOfType) {
      dispatch(getChangeTypeShowAction(type));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Header));

import React, { useState } from "react";
import { Menu } from "antd";
import { MenuInfo } from "_rc-menu@8.6.1@rc-menu/lib/interface";
import Recommend from "../Recommend";
import { CSSTransition } from "react-transition-group";
import TotalPlaylists from "../TotalPlaylists";
import Rank from "../Rank";
import SingerRank from "../SingerRank";
import { connect } from "react-redux";
import { UnionStateTypes } from "../../store";
import { getChangeTypeShowAction } from "../Home/store/actionCreator";

type currentType =
  | "recommend"
  | "totalPlaylist"
  | "rank"
  | "singer"
  | "singerRank";

interface SearchMusicProps {
  current: currentType;
  changeShow: (currType: showOfType) => void;
}

const SearchMusic: React.FC<SearchMusicProps> = (props) => {
  const { current, changeShow } = props;
  const [firstRequest, setFirstRequest] = useState({
    recommend: true,
    totalPlaylist: false,
    rank: false,
    singer: false,
    singerRank: false
  });

  function handleItemClick(e: MenuInfo) {
    const key = e.key as currentType;
    changeShow(key);
    const _firstRequest = { ...firstRequest };
    if (!_firstRequest[key]) {
      _firstRequest[key] = true;
      setFirstRequest(_firstRequest);
    }
  }

  function returnTransition(type: currentType, el: React.ReactElement) {
    return (
      <CSSTransition
        in={current === type}
        timeout={400}
        mountOnEnter={true}
        classNames={{
          enter: "animate__animated",
          enterActive: "animate__fadeIn"
        }}
      >
        {el}
      </CSSTransition>
    );
  }

  function displaySingerRank() {
    changeShow("singerRank");
  }

  return (
    <div className="search-music">
      <div className="nav">
        <Menu
          mode="horizontal"
          selectedKeys={[current]}
          onClick={handleItemClick}
        >
          <Menu.Item title="个性推荐" key="recommend">
            个性推荐
          </Menu.Item>
          <Menu.Item title="歌单" key="totalPlaylist">
            歌单
          </Menu.Item>
          <Menu.Item title="排行榜" key="rank">
            排行榜
          </Menu.Item>
          <Menu.Item title="歌手" key="singer">
            歌手
          </Menu.Item>
        </Menu>
      </div>
      <div className="search-music-content">
        {returnTransition(
          "recommend",
          <Recommend
            firstRequest={firstRequest.recommend}
            show={current === "recommend"}
            moreClick={() => changeShow("playlist")}
          />
        )}
        {returnTransition(
          "totalPlaylist",
          <TotalPlaylists
            firstRequest={firstRequest.totalPlaylist}
            show={current === "totalPlaylist"}
          />
        )}
        {returnTransition(
          "rank",
          <Rank
            displaySingerRank={displaySingerRank}
            firstRequest={firstRequest.rank}
            show={current === "rank"}
          />
        )}
        {returnTransition(
          "singerRank",
          <SingerRank show={current === "singerRank"} />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (
  state: UnionStateTypes
): {
  current: currentType;
} => {
  const home = state.home;
  console.log(home);
  return {
    current: home.currLinkedItem.currType as currentType
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    changeShow(currType: showOfType) {
      dispatch(getChangeTypeShowAction(currType));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(SearchMusic));

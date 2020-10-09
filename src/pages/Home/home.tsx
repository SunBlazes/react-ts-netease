import React, { useState, createContext, useEffect, useRef } from "react";
import Header from "../../common/Header";
import SignIn from "../../common/SignIn";
import { Layout, Menu } from "antd";
import { CustomerServiceOutlined, HeartOutlined } from "@ant-design/icons";
import SearchMusic from "../SearchMusic";
import { MenuInfo } from "_rc-menu@8.6.1@rc-menu/lib/interface";
import Player from "../../common/Player";
import SongDetail from "../../common/SongDetail";
import MoreComments from "../../common/comments/moreComments";
import { connect } from "react-redux";
import { UnionStateTypes } from "../../store";
import PlayList from "../PlayList";
import SingerDetail from "../SingerDetail";
import MV from "../MV";

type currentType = "recommend";

export interface HomeProps {
  moreCommentsShow: boolean;
  currType: string;
}

export interface IPlaylistContext {
  changePlaylistId: (id: string) => void;
}

export interface ISingerDetailContext {
  changeSingerId: (id: string) => void;
}

export interface IMVContext {
  changeMVId: (id: string) => void;
}

export const PlaylistContext = createContext<IPlaylistContext>({
  changePlaylistId: () => {}
});

export const SingerDetailContext = createContext<ISingerDetailContext>({
  changeSingerId: () => {}
});

export const MVContext = createContext<IMVContext>({
  changeMVId: () => {}
});

const Home: React.FC<HomeProps> = (props) => {
  const { moreCommentsShow, currType } = props;
  const [current, setCurrent] = useState<currentType>("recommend");
  const [playlistId, setPlaylistId] = useState("");
  const [singerId, setSingerId] = useState("");
  const [mvId, setMVId] = useState("");
  /* const scrollTopMap = useRef(
    new Map<showOfType, number>([
      ["playlist", 0],
      ["songDetailContent", 0],
      ["moreComments", 0],
      ["comments", 0],
      ["recommend", 0],
      ["totalPlaylist", 0],
      ["rank", 0],
      ["singer", 0],
      ["singerRank", 0],
      ["songDetailContent", 0],
      ["singerDetail", 0]
    ])
  ); */

  const passedPlaylistContextValue: IPlaylistContext = {
    changePlaylistId
  };

  const passedSingerContextValue: ISingerDetailContext = {
    changeSingerId
  };

  const passedMVContext: IMVContext = {
    changeMVId
  };

  function changePlaylistId(id: string) {
    setPlaylistId(id);
  }

  function changeSingerId(id: string) {
    setSingerId(id);
  }

  function changeMVId(id: string) {
    setMVId(id);
  }

  function handleItemClick(e: MenuInfo) {
    const key = e.key as currentType;
    setCurrent(key);
  }

  // useEffect(() => {
  //   const el = document.getElementsByClassName("home-content")[0];
  //   const map = scrollTopMap.current;

  //   if (el) {
  //     setTimeout(() => {
  //       el.scroll({ top: map.get(currType as showOfType) });
  //     });
  //   }
  //   return () => {
  //     map.set(currType as showOfType, el.scrollTop);
  //   };
  // }, [currType]);

  return (
    <div className="home">
      <Header />
      <SignIn />
      <PlayList id={playlistId} />
      <Layout style={{ overflow: "hidden" }}>
        <Layout.Sider className="home-sider">
          <Menu selectedKeys={[current]} onClick={handleItemClick}>
            <Menu.ItemGroup title="推荐">
              <Menu.Item
                title="发现音乐"
                icon={<CustomerServiceOutlined />}
                key="recommend"
              >
                发现音乐
              </Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="我的音乐">
              <Menu.Item title="我喜欢的音乐" icon={<HeartOutlined />}>
                我喜欢的音乐
              </Menu.Item>
            </Menu.ItemGroup>
          </Menu>
          <PlaylistContext.Provider value={passedPlaylistContextValue}>
            <SongDetail />
          </PlaylistContext.Provider>
        </Layout.Sider>
        <Layout.Content className="home-content">
          <PlaylistContext.Provider value={passedPlaylistContextValue}>
            <SingerDetailContext.Provider value={passedSingerContextValue}>
              <SearchMusic />
              <MVContext.Provider value={passedMVContext}>
                <SingerDetail id={singerId} />
              </MVContext.Provider>
            </SingerDetailContext.Provider>
          </PlaylistContext.Provider>
          {moreCommentsShow && <MoreComments />}
          <MV id={mvId} />
        </Layout.Content>
      </Layout>
      <Layout.Footer className="home-footer">
        <Player />
      </Layout.Footer>
    </div>
  );
};

const mapStateToProps = (state: UnionStateTypes) => {
  const home = state.home;
  return {
    moreCommentsShow: home.showMap.get("moreComments") as boolean,
    currType: home.currLinkedItem.currType
  };
};

export default connect(mapStateToProps)(React.memo(Home));

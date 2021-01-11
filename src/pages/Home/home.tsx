import React, { useState, useEffect } from "react";
import Header from "../../common/Header";
import SignIn from "../../common/SignIn";
import { Layout, Menu, message } from "antd";
import { CustomerServiceOutlined, UnderlineOutlined } from "@ant-design/icons";
import SearchMusic from "../SearchMusic";
import Player from "../../common/Player";
import SongDetail from "../../common/SongDetail";
import MoreComments from "../../common/comments/moreComments";
import { connect } from "react-redux";
import { UnionStateTypes } from "../../store";
import PlayList from "../PlayList";
import SingerDetail from "../SingerDetail";
import MV from "../MV";
import SearchResult from "../SearchResult";
import Album from "../Album";
import { Route, Link, Switch, useHistory, Redirect } from "react-router-dom";
import { KeepAlive, createContext } from "react-activation";
import { CSSTransition } from "react-transition-group";
import Mylove from "../Mylove";
import axios from "../../network";

export interface HomeProps {
  userState: boolean;
  userId: string;
  userName: string;
  avatarUrl: string;
}

export interface HistoryStackProps {
  prev?: HistoryStackProps;
  next?: HistoryStackProps;
  name: string;
}

export interface IMylove {
  name: string;
  id: string;
}

export const SetHistoryStackContext = createContext<{
  setHistoryStack: (
    type: "prev" | "next" | "push" | "remove" | "clear",
    name: string
  ) => void;
}>({
  setHistoryStack: () => {}
});

const Home: React.FC<HomeProps> = (props) => {
  const { userId, userName, avatarUrl } = props;
  const [current, setCurrent] = useState("recommend");
  const [historyStack, setHistoryStack] = useState<HistoryStackProps>({
    name: "recommend"
  });
  const [myloves, setMyloves] = useState<IMylove[]>([]);
  const history = useHistory();
  const passedSetHistoryStack: {
    setHistoryStack: (
      type: "prev" | "next" | "push" | "remove" | "clear",
      name: string
    ) => void;
  } = {
    setHistoryStack(type, name) {
      switch (type) {
        case "push": {
          const item: HistoryStackProps = {
            name,
            prev: historyStack
          };
          historyStack.next = item;
          setHistoryStack(item);
          break;
        }
        case "next": {
          setHistoryStack(historyStack.next as HistoryStackProps);
          break;
        }
        case "prev": {
          setHistoryStack(historyStack.prev as HistoryStackProps);
          break;
        }
        case "remove": {
          if (name === "prev") {
            if (historyStack.prev) {
              historyStack.prev.next = undefined;
              setHistoryStack(historyStack.prev as HistoryStackProps);
            }
          } else {
            if (historyStack.next) {
              historyStack.next.next = undefined;
              setHistoryStack(historyStack.next as HistoryStackProps);
            }
          }
          break;
        }
        case "clear": {
          historyStack.prev = undefined;
          historyStack.next = undefined;
          historyStack.name = "recommend";
          setHistoryStack(historyStack);
          break;
        }
        default:
          return;
      }
    }
  };

<<<<<<< HEAD
  useEffect(() => {
    function handleOffline() {
      console.log("offline");
      message.error({
        content: "亲, 请连接网络 !!",
        duration: 0
      });
=======
  function changeKeywords(keywords: string) {
    setKeywords(keywords);
  }

  function changePlaylistId(id: string) {
    setPlaylistId(id);
  }

  function changeAlbumId(id: string) {
    setAlbumId(id);
  }

  function changeSingerId(id: string) {
    setSingerId(id);
  }

  function changeMVId(id: string) {
    setMVId(id);
  }

  function handleItemClick(e: any) {
    const key = e.key as currentType;
    setCurrent(key);

    if (key === "mylove") {
      handleMyLove();
>>>>>>> ed6b652f683d68cadbed2cc516b8539c7ce1a01d
    }

    function handleOnline() {
      console.log("online");
      message.destroy();
      message.success({
        content: "已连接到网络 !!",
        duration: 1
      });
    }
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
  }, []);

  useEffect(() => {
    function fetchData() {
      axios.get("/user/playlist?uid=" + userId).then(({ data }) => {
        const arr: IMylove[] = [];
        const playlists = data.playlist as any[];
        for (let i = 0; i < playlists.length; i++) {
          const item = playlists[i];
          arr.push({
            name: item.name,
            id: item.id
          });
        }
        setMyloves(arr);
      });
    }

    if (userId) fetchData();
    else {
      setMyloves([]);
      setCurrent("recommend");
    }
  }, [userId]);

  function handleItemClick(e: any) {
    const key = e.key as string;
    const keyarr = key.split(" ");
    if (keyarr.length === 2) {
      history.push(`/${keyarr[0]}/${keyarr[1]}`);
      passedSetHistoryStack.setHistoryStack("push", keyarr[0]);
      setCurrent(key);
      return;
    }
    history.push(`/${key === "recommend" ? "" : key}`);
    passedSetHistoryStack.setHistoryStack("push", key);
    setCurrent(key);
  }

  function returnMyLoves() {
    return myloves.map((love) => {
      return (
        <Menu.Item
          title={love.name}
          icon={<UnderlineOutlined />}
          key={"mylove " + love.id}
        >
          {love.name}
        </Menu.Item>
      );
    });
  }

  return (
    <div className="home">
      <SetHistoryStackContext.Provider value={passedSetHistoryStack}>
        <Header historyStack={historyStack} />
      </SetHistoryStackContext.Provider>
      <SignIn />
      <Layout style={{ overflow: "hidden" }}>
        <Layout.Sider className="home-sider">
          <Menu selectedKeys={[current]} onClick={handleItemClick}>
            <Menu.ItemGroup title="推荐">
              <Menu.Item
                title="发现音乐"
                icon={<CustomerServiceOutlined />}
                key="recommend"
              >
                <Link to="/">发现音乐</Link>
              </Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="我的音乐(需登录)">
              {returnMyLoves()}
            </Menu.ItemGroup>
          </Menu>
          <SetHistoryStackContext.Provider value={passedSetHistoryStack}>
            <SongDetail />
          </SetHistoryStackContext.Provider>
        </Layout.Sider>
        <Layout.Content className="home-content">
          <SetHistoryStackContext.Provider value={passedSetHistoryStack}>
            <Switch>
              <Route path="/mylove/:id">
                {(render) =>
                  userId ? (
                    <KeepAlive name="mylove">
                      <Mylove
                        match={render.match!}
                        avatarUrl={avatarUrl}
                        userName={userName}
                      />
                    </KeepAlive>
                  ) : (
                    <Redirect to="/" />
                  )
                }
              </Route>
              <Route path="/moreComments/:type/:id">
                {(render) => <MoreComments match={render.match!} />}
              </Route>
              <Route path="/singerDetail/:id">
                {(render) => (
                  <KeepAlive name="album">
                    <SingerDetail match={render.match!} />
                  </KeepAlive>
                )}
              </Route>
              <Route path="/mv/:id">
                {(render) => (
                  <CSSTransition
                    in={render.location.pathname.includes("mv")}
                    timeout={200}
                    mountOnEnter
                    classNames={{
                      enter: "animate__animated",
                      enterActive: "animate__fadeIn"
                    }}
                    unmountOnExit
                  >
                    <MV match={render.match!} />
                  </CSSTransition>
                )}
              </Route>
              <Route path="/album/:id">
                {(render) => (
                  <KeepAlive name="album">
                    <Album match={render.match!} />
                  </KeepAlive>
                )}
              </Route>
              <Route path="/playlist/:id">
                {(render) => (
                  <KeepAlive name="playlist">
                    <PlayList match={render.match!} />
                  </KeepAlive>
                )}
              </Route>
              <Route path="/searchResult/:keywords">
                {(render) => (
                  <KeepAlive name="searchResult">
                    <SearchResult match={render.match!} />
                  </KeepAlive>
                )}
              </Route>
              <Route path="/">
                <SearchMusic />
              </Route>
            </Switch>
          </SetHistoryStackContext.Provider>
        </Layout.Content>
      </Layout>
      <Layout.Footer className="home-footer">
        <SetHistoryStackContext.Provider value={passedSetHistoryStack}>
          <Player />
        </SetHistoryStackContext.Provider>
      </Layout.Footer>
    </div>
  );
};

const mapStateToProps = (state: UnionStateTypes) => {
  const header = state.header;

  return {
    userState: header.userState,
    userId: header.user.userId,
    userName: header.user.nickname,
    avatarUrl: header.user.avatarUrl
  };
};

export default connect(mapStateToProps)(React.memo(Home));

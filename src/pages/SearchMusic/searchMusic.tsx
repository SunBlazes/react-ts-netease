import React, { useContext } from "react";
import Recommend from "../Recommend";
import { CSSTransition } from "react-transition-group";
import TotalPlaylists from "../TotalPlaylists";
import Rank from "../Rank";
import SingerRank from "../SingerRank";
import classnames from "classnames";
import KeepAlive from "react-activation";
import { Route, useHistory } from "react-router-dom";
import { SetHistoryStackContext } from "../Home";

type currentType =
  | "recommend"
  | "totalPlaylist"
  | "rank"
  | "singer"
  | "singerRank";

interface SearchMusicProps {}

const SearchMusic: React.FC<SearchMusicProps> = () => {
  const history = useHistory();
  const classes = classnames("search-music");
  const context = useContext(SetHistoryStackContext);

  function moreClick() {
    context.setHistoryStack("push", "totalPlaylist");
    history.push("/totalPlaylist");
  }

  function returnTransition(
    type: currentType,
    el: React.ReactElement,
    path?: string
  ) {
    const _path = path ? path : "/" + type;
    return (
      <Route path={_path}>
        {({ location }) => {
          return (
            <CSSTransition
              in={
                location.pathname.includes(type) ||
                (type === "recommend" && location.pathname === "/")
              }
              timeout={200}
              mountOnEnter={true}
              unmountOnExit
              classNames={{
                enter: "animate__animated",
                enterActive: "animate__fadeIn",
                exit: "animate__animated",
                exitActive: "animate__fadeOut"
              }}
            >
              <KeepAlive name={type}>{el}</KeepAlive>
            </CSSTransition>
          );
        }}
      </Route>
    );
  }

  return (
    <div className={classes}>
      <div className="search-music-content">
        {returnTransition(
          "recommend",
          <Recommend moreClick={moreClick} />,
          "/"
        )}
        <Route path="/totalPlaylist/:type?">
          {(render) => {
            return (
              <CSSTransition
                in={render.location.pathname.includes("totalPlaylist")}
                timeout={200}
                mountOnEnter={true}
                unmountOnExit
                classNames={{
                  enter: "animate__animated",
                  enterActive: "animate__fadeIn",
                  exit: "animate__animated",
                  exitActive: "animate__fadeOut"
                }}
              >
                <KeepAlive>
                  <TotalPlaylists match={render.match!} />
                </KeepAlive>
              </CSSTransition>
            );
          }}
        </Route>
        {returnTransition("rank", <Rank />)}
        {returnTransition("singerRank", <SingerRank />)}
      </div>
    </div>
  );
};

export default React.memo(SearchMusic);

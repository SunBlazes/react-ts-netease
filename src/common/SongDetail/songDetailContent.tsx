import React, { useRef, useEffect, useState, useContext, useMemo } from "react";
import {
  HeartFilled,
  FolderAddOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  ShrinkOutlined
} from "@ant-design/icons";
import { parseLyrics } from "../../utils";
import { CSSTransition } from "react-transition-group";
import { connect } from "react-redux";
import { UnionStateTypes } from "../../store";
import { fetchPlayLyric } from "../Player/store";
import Comments from "../comments";
import SimiPlaylist from "../SimiPlaylist";
import { SetHistoryStackContext } from "../../pages/Home";
import classnames from "classnames";
import { useHistory, withRouter, RouteComponentProps } from "react-router-dom";

export interface SongDetailContentProps extends SongDetailContent {
  hide: (flag: boolean) => void;
}

const SongDetailContent: React.FC<
  SongDetailContentProps & RouteComponentProps
> = (props) => {
  const { show, fetchPlayLyric, songDetail, lyricStr, playState, hide } = props;
  const classes = useMemo(() => {
    return classnames("zsw-song-detail-content", {
      hidden: !show
    });
  }, [show]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollInnerRef = useRef<HTMLDivElement>(null);
  const [lyrics, setLyrics] = useState<Array<LyricRegItem>>([]);
  const timerRef = useRef<any>();
  const [currLyricIndex, changeCurrLyricIndex] = useState(0);
  const context = useContext(SetHistoryStackContext);
  const history = useHistory();

  useEffect(() => {
    if (!lyricStr) {
      fetchPlayLyric(songDetail.id);
    }
  }, [fetchPlayLyric, songDetail.id, lyricStr]);

  useEffect(() => {
    changeCurrLyricIndex(0);
    setLyrics([]);
  }, [songDetail.id]);

  useEffect(() => {
    if (lyricStr) {
      setLyrics(parseLyrics(lyricStr));
    }
  }, [lyricStr]);

  useEffect(() => {
    function scrollTo(top: number) {
      let dis = top - 240 <= 0 ? 0 : top - 240;
      if (scrollRef && scrollRef.current) {
        scrollRef.current.scrollTo({ top: dis });
      }
    }
    function scrollNext(
      audio: HTMLAudioElement,
      currlyric: Array<LyricRegItem>,
      children: HTMLCollection
    ) {
      for (let i = currLyricIndex; i < currlyric.length; i++) {
        const nextIndex =
          i + 1 >= currlyric.length ? currlyric.length - 1 : i + 1;
        if (
          i === currlyric.length - 1 &&
          audio.currentTime >= currlyric[i].second &&
          i !== currLyricIndex
        ) {
          scrollTo((children[i] as HTMLParagraphElement).offsetTop);
          return changeCurrLyricIndex(i);
        }
        if (
          audio.currentTime >= currlyric[i].second &&
          audio.currentTime < currlyric[nextIndex].second &&
          i !== currLyricIndex
        ) {
          scrollTo((children[i] as HTMLParagraphElement).offsetTop);
          return changeCurrLyricIndex(i);
        }
      }
    }
    function scrollPrev(
      audio: HTMLAudioElement,
      currlyric: Array<LyricRegItem>,
      children: HTMLCollection
    ) {
      for (let i = currLyricIndex; i >= 0; i--) {
        const prevIndex = i - 1 <= 0 ? 0 : i - 1;
        if (
          i === 0 &&
          audio.currentTime <= currlyric[i].second &&
          i !== currLyricIndex
        ) {
          scrollTo((children[i] as HTMLParagraphElement).offsetTop);
          return changeCurrLyricIndex(i);
        }
        if (
          audio.currentTime <= currlyric[i].second &&
          audio.currentTime > currlyric[prevIndex].second &&
          i !== currLyricIndex
        ) {
          scrollTo((children[prevIndex] as HTMLParagraphElement).offsetTop);
          return changeCurrLyricIndex(prevIndex);
        }
      }
    }
    function scroll() {
      if (
        scrollInnerRef &&
        scrollInnerRef.current &&
        scrollInnerRef.current.children.length !== 0
      ) {
        const children = scrollInnerRef.current.children;
        const currlyric = lyrics;
        const audio = window.audio;
        if (audio.currentTime < currlyric[currLyricIndex].second) {
          scrollPrev(audio, currlyric, children);
        } else {
          scrollNext(audio, currlyric, children);
        }
      }
    }
    if (lyrics.length !== 0) {
      timerRef.current = setInterval(() => {
        if (!playState) {
          return clearInterval(timerRef.current);
        }
        scroll();
      });
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [playState, currLyricIndex, lyrics]);

  useEffect(() => {
    hide(false);
  }, [props.location.pathname, hide]);

  function handleSimiPlaylistClick(id: string) {
    hide(false);
    context.setHistoryStack("push", "playlist");
    history.push("/playlist/" + id);
  }

  function toSingerDetail(id: string) {
    hide(false);
    context.setHistoryStack("push", "singerDetail");
    history.push("/singerDetail/" + id);
  }

  function toAlbum(id: string) {
    hide(false);
    context.setHistoryStack("push", "album");
    history.push("/album/" + id);
  }

  return (
    <CSSTransition
      in={show === true}
      timeout={{
        enter: 400
      }}
      mountOnEnter
      classNames={{
        enter: "animate__animated enter",
        enterActive: "animate__fadeIn"
      }}
    >
      <div className={classes}>
        <div>
          <div className="zsw-song-detail-content-top">
            <div
              className="zsw-song-detail-content-top-overlay"
              style={{
                backgroundImage: `url(${songDetail.picUrl})`
              }}
            ></div>
            <div className="zsw-song-detail-content-top-content">
              <div className="zsw-song-detail-content-top-left">
                <div
                  className={`zsw-song-detail-content-top-left-round ${
                    playState ? "spin" : ""
                  }`}
                >
                  <img src={songDetail.picUrl} alt="" />
                </div>
                <ul className="zsw-song-detail-content-top-left-tags">
                  <li>
                    <HeartFilled />
                    喜欢
                  </li>
                  <li>
                    <FolderAddOutlined />
                    添加
                  </li>
                  <li>
                    <DownloadOutlined />
                    收藏
                  </li>
                  <li>
                    <ShareAltOutlined />
                    分享
                  </li>
                </ul>
              </div>
              <div className="zsw-song-detail-content-top-right">
                <h3>
                  {songDetail.name}
                  <ShrinkOutlined
                    className="shrink"
                    onClick={() => hide(false)}
                  />
                </h3>
                {songDetail.alia && (
                  <p className="zsw-song-detail-content-top-right-alia">
                    {songDetail.alia}
                  </p>
                )}
                <div className="zsw-song-detail-content-top-right-detail">
                  专辑:{" "}
                  <span
                    className="album-name"
                    onClick={() => toAlbum(songDetail.albumId)}
                  >
                    {songDetail.album}
                  </span>
                  歌手:
                  {songDetail.singers.map((singer) => (
                    <span
                      className="singer-name"
                      key={singer.id}
                      onClick={() => toSingerDetail(singer.id)}
                    >
                      {singer.name}
                    </span>
                  ))}
                </div>
                <br />
                <div
                  className="zsw-song-detail-content-top-right-scroll"
                  ref={scrollRef}
                >
                  <div ref={scrollInnerRef}>
                    {lyrics.map((lyric, index) => {
                      return (
                        <p
                          key={`${lyric.second} ${index}`}
                          className={`${
                            index === currLyricIndex ? "active" : ""
                          }`}
                        >
                          {lyric.content}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="zsw-song-detail-content-bottom">
            <div className="zsw-song-detail-content-bottom-left">
              <div className="zsw-song-detail-content-bottom-title">
                听友评论
              </div>
              {show && (
                <Comments
                  type="music"
                  id={songDetail.id}
                  beforeClickMoreComments={() => hide(false)}
                />
              )}
            </div>
            {show && (
              <div className="zsw-song-detail-content-bottom-right">
                <div className="zsw-song-detail-content-bottom-title">
                  包含这首歌的歌单
                </div>
                <SimiPlaylist
                  id={songDetail.id}
                  onClick={handleSimiPlaylistClick}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

const mapStateToProps = (state: UnionStateTypes) => {
  const player = state.player;
  const id = player.playQueue[player.current];

  return {
    playState: player.playState,
    lyricStr: player.playLyricMap.get(id)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchPlayLyric(id: string) {
      dispatch(fetchPlayLyric(id));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(React.memo(SongDetailContent)));

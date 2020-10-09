import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { UnionStateTypes } from "../../store";
import { CSSTransition } from "react-transition-group";
import axios from "../../network";
import { FolderAddOutlined } from "@ant-design/icons";
import SingerAlbum from "./singerAlbum";
import classnames from "classnames";
import SingerInfo from "./singerInfo";
import SingerMV from "./singerMV";
import SimiSingers from "./simiSingers";

type currentType = "album" | "mv" | "singerInfo" | "simiSinger";
const SingerDetail: React.FC<SingerDetailProps> = (props) => {
  const { show, id } = props;
  const [songsCount, setSongsCount] = useState(0);
  const [albumsCount, setAlbumsCount] = useState(0);
  const [singerName, setSingerName] = useState("");
  const [picUrl, setPicUrl] = useState("");
  const [current, setCurrent] = useState<currentType>("album");
  const classes = classnames("zsw-singer-detail", {
    hidden: !show
  });

  function itemClick(curr: currentType) {
    setCurrent(curr);
  }

  useEffect(() => {
    setCurrent("album");
  }, [id]);

  useEffect(() => {
    let isUnmount = false;
    async function fetchSingerSongsCount() {
      const { data } = await axios.get(`/artist/songs?id=${id}&limit=0`);
      !isUnmount && setSongsCount(data.total);
    }
    async function fetchSingerAlbums() {
      const { data } = await axios.get(`/artist/album?id=${id}&limit=100`);
      if (!isUnmount) {
        setAlbumsCount(data.artist.albumSize);
        setSingerName(data.artist.name);
        setPicUrl(data.artist.picUrl);
      }
    }
    if (id) {
      fetchSingerSongsCount();
      fetchSingerAlbums();
    }

    return () => {
      isUnmount = true;
    };
  }, [id]);

  return (
    <CSSTransition
      in={show === true}
      timeout={400}
      mountOnEnter
      classNames={{
        enter: "animate__animated",
        enterActive: "animate__fadeIn",
        exit: "animate__animated",
        exitActive: "animate__fadeOut"
      }}
      unmountOnExit
    >
      <div className={classes}>
        <div>
          <div className="zsw-singer-detail-top">
            <div
              className="zsw-singer-detail-top-img"
              style={{
                backgroundImage: `url(${picUrl}?param=200y200)`
              }}
            ></div>
            <div className="zsw-singer-detail-info">
              <p className="zsw-singer-detail-info-panel-1">
                <span className="zsw-singer-detail-info-panel-1-tag">歌手</span>
                <span className="zsw-singer-detail-info-panel-1-name">
                  {singerName}
                </span>
              </p>
              <p className="zsw-singer-detail-info-panel-2">
                <span className="iconfont icon-music_note">单曲数:</span>
                <span className="zsw-singer-detail-info-panel-2-count">
                  {songsCount}
                </span>
              </p>
              <p className="zsw-singer-detail-info-panel-3">
                <span className="iconfont icon-changpian1">专辑数:</span>
                <span className="zsw-singer-detail-info-panel-3-count">
                  {albumsCount}
                </span>
              </p>
            </div>
            <div className="zsw-singer-detail-top-btn">
              <FolderAddOutlined />
              收藏
            </div>
          </div>
          <ul className="playlist-info-nav">
            <li
              onClick={() => itemClick("album")}
              className={current === "album" ? "sele" : ""}
            >
              专辑
            </li>
            <li
              onClick={() => itemClick("mv")}
              className={current === "mv" ? "sele" : ""}
            >
              MV
            </li>
            <li
              onClick={() => itemClick("singerInfo")}
              className={current === "singerInfo" ? "sele" : ""}
            >
              歌手详情
            </li>
            <li
              onClick={() => itemClick("simiSinger")}
              className={current === "simiSinger" ? "sele" : ""}
            >
              相似歌手
            </li>
          </ul>
          <div className="zsw-singer-detail-content">
            <SingerAlbum id={id} show={current === "album"} />
            <SingerInfo id={id} show={current === "singerInfo"} />
            <SingerMV id={id} show={current === "mv"} />
            <SimiSingers id={id} show={current === "simiSinger"} />
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

const mapStateToProps = (state: UnionStateTypes) => {
  const home = state.home;

  return {
    show: home.showMap.get("singerDetail") as boolean
  };
};

export default connect(mapStateToProps)(React.memo(SingerDetail));

import React, { useState, useEffect, useRef } from "react";
import {
  PlayCircleOutlined,
  FolderAddOutlined,
  ShareAltOutlined,
  DownloadOutlined
} from "@ant-design/icons";
import AlbumSongs from "./albumSongs";
import axios from "../../network";
import * as types from "./types";
import {
  parseDate,
  parseTime,
  mergeSingerNames,
  parseCopyright
} from "../../utils";
import { connect } from "react-redux";
import { getSetPlayDetailMapAction } from "../../common/Player/store";
import Comments from "../../common/comments";
import classnames from "classnames";
import { UnionStateTypes } from "../../store";

const Album: React.FC<types.AlbumProps> = (props) => {
  const { setPlayDetailMap, id, show } = props;
  const [current, setCurrent] = useState<types.currentType>("songs");
  const [info, setInfo] = useState<types.AlbumInfo>();
  const [songs, setSongs] = useState<types.IAlbumSongItem[]>([]);
  const map = useRef<Map<string, PlayDetailItem>>(
    new Map<string, PlayDetailItem>()
  );
  const [loading, setLoading] = useState(false);
  const classes = classnames("album", {
    hidden: !show
  });

  useEffect(() => {
    let isUnmount = false;
    function parseInfo(data: any): types.AlbumInfo {
      return {
        picUrl: data.picUrl,
        publishTime: data.publishTime,
        name: data.name,
        description: data.description,
        artistName: data.artist.name,
        shareCount: data.info.shareCount
      };
    }
    function parseSongs(songs: any[]) {
      console.log(songs);
      const _arr: types.IAlbumSongItem[] = [];

      for (let i = 0; i < songs.length; i++) {
        const {
          al: { name, picUrl },
          ar,
          id,
          dt,
          noCopyrightRcmd,
          alia,
          pop,
          fee
        } = songs[i];
        const copyright = parseCopyright(noCopyrightRcmd, fee);

        const parsedItem = {
          duration: parseTime(dt),
          singerName: mergeSingerNames(ar),
          id,
          index: (i + 1).toString().padStart(2, "0"),
          album: name,
          picUrl,
          name: songs[i].name,
          hasCopyRight: copyright,
          alia: alia.join(",")
        };
        if (copyright) {
          map.current.set(id, parsedItem);
        }
        _arr.push(Object.assign({}, parsedItem, { pop }));
      }

      return _arr;
    }
    async function fetchData() {
      !isUnmount && setSongs([]);
      !isUnmount && setLoading(true);
      const { data } = await axios.get("/album?id=" + id);
      !isUnmount && setInfo(parseInfo(data.album));
      !isUnmount && setSongs(parseSongs(data.songs));
      !isUnmount && setPlayDetailMap(map.current);
      !isUnmount && setLoading(false);
    }
    if (id && current === "songs") {
      fetchData();
    }
    return () => {
      isUnmount = true;
    };
  }, [id, current, setPlayDetailMap]);

  function itemClick(curr: types.currentType) {
    setCurrent(curr);
  }

  function parseDescription(str: string) {
    const arr = str.split(/(\n)+/);

    return arr.map((item, index) => {
      return (
        <p className="content" key={index}>
          {item}
        </p>
      );
    });
  }

  return (
    <div className={classes}>
      <div>
        <div className="album-top">
          <div className="album-top-left">
            <img
              src={
                info
                  ? info.picUrl + "?param=200y200"
                  : "https://p2.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg"
              }
              alt=""
            />
          </div>
          <div className="album-top-right">
            <div className="album-panel-1">
              <i>专辑</i>
              <span>{info ? info.name : ""}</span>
            </div>
            <div className="album-panel-2">
              <ul>
                <li>
                  <PlayCircleOutlined />
                  播放全部
                </li>
                <li>
                  <FolderAddOutlined />
                  收藏
                </li>
                <li>
                  <ShareAltOutlined />
                  分享({info ? info.shareCount : ""})
                </li>
                <li>
                  <DownloadOutlined />
                  下载全部
                </li>
              </ul>
            </div>
            <div className="album-panel-3">
              <p>
                歌手:
                <span className="singer-name">
                  {info ? info.artistName : ""}
                </span>
              </p>
              <p>
                时间:
                <span>
                  {info ? parseDate("YYYY-mm-dd", info.publishTime) : ""}
                </span>
              </p>
            </div>
          </div>
        </div>
        <ul className="album-nav">
          <li
            onClick={() => itemClick("songs")}
            className={current === "songs" ? "sele" : ""}
          >
            歌曲列表
          </li>
          <li
            onClick={() => itemClick("comments")}
            className={current === "comments" ? "sele" : ""}
          >
            评论
          </li>
          <li
            onClick={() => itemClick("albumInfo")}
            className={current === "albumInfo" ? "sele" : ""}
          >
            专辑详情
          </li>
        </ul>
        {current === "songs" && <AlbumSongs songs={songs} loading={loading} />}
        {current === "comments" && <Comments type="album" id={id} />}
        {current === "albumInfo" && (
          <div className="album-info">
            <div className="title">专辑介绍</div>
            {info ? parseDescription(info.description) : ""}
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: UnionStateTypes) => {
  const home = state.home;
  return {
    show: home.showMap.get("album") as boolean
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setPlayDetailMap(map: Map<string, PlayDetailItem>) {
      dispatch(getSetPlayDetailMapAction(map));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album));

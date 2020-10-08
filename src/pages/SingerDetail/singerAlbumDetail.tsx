import React, { useState, useEffect, useRef } from "react";
import SingerAlbumItem from "./singerAlbumItem";
import { LoadingOutlined, RightOutlined } from "@ant-design/icons";
import axios from "../../network";
import { parseTime, mergeSingerNames } from "../../utils";
import classnames from "classnames";
import { connect } from "react-redux";
import { UnionStateTypes } from "../../store";
import { message } from "antd";
import {
  getSetPlayDetailMapAction,
  getPushPlayQueueAction,
  fetchPlayUrl,
  getChangePlayIndexAction
} from "../../common/Player/store";

const SingerAlbumDetail: React.FC<SingerAlbumDetailProps> = (props) => {
  const {
    id,
    playQueue,
    currIndex,
    playState,
    pushPlayQueue,
    setPlayDetailMap,
    changePlayIndex,
    fetchPlayUrl,
    title,
    needExpand,
    top50,
    picUrl
  } = props;
  const [selectedIndex, changeSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [albumData, setAlbumData] = useState<ISingerAlbumItem[]>([]);
  const [expand, setExpand] = useState(false);
  const classes = classnames("zsw-singer-album-detail-content", {
    expand,
    top50
  });
  const onlyPushOnce = useRef(false);
  const trackIdsRef = useRef<string[]>([]);

  function handleItemClick(index: number) {
    changeSelectedIndex(index);
  }

  function hanldeDoubleClick(id: string, hasCopyRight: boolean) {
    if (!hasCopyRight)
      return message.error({
        content: "因合作方要求，该资源暂时下架>_<"
      });
    if (!onlyPushOnce.current) {
      pushPlayQueue(trackIdsRef.current);
      onlyPushOnce.current = true;
    }
    fetchPlayUrl(id);
    changePlayIndex(id);
  }

  useEffect(() => {
    let isUnmount = false;
    trackIdsRef.current = [];
    function parseSongs(arr: any[]) {
      const _arr: ISingerAlbumItem[] = [];
      const _map = new Map<string, PlayDetailItem>();
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        const { name, id, dt, alia, noCopyrightRcmd, ar, al } = item;
        trackIdsRef.current.push(item.id);
        _map.set(item.id, {
          name,
          duration: parseTime(dt),
          singerName: mergeSingerNames(ar),
          picUrl: al.picUrl,
          album: al.name,
          alia,
          id,
          hasCopyRight: noCopyrightRcmd ? false : true
        });
        _arr.push({
          name,
          id,
          duration: parseTime(dt),
          alia: alia.join(" "),
          index: (i + 1).toString().padStart(2, "0"),
          hasCopyRight: noCopyrightRcmd ? false : true
        });
      }
      setPlayDetailMap(_map);
      return _arr;
    }
    async function fetchData() {
      !isUnmount && setLoading(true);
      if (top50) {
        const { data } = await axios.get("/artist/top/song?id=" + id);
        !isUnmount && setAlbumData(parseSongs(data.songs));
      } else {
        const { data } = await axios.get("/album?id=" + id);
        !isUnmount && setAlbumData(parseSongs(data.songs));
      }
      !isUnmount && setLoading(false);
    }
    if (id) {
      fetchData();
    }

    return () => {
      isUnmount = true;
    };
  }, [id, top50, setPlayDetailMap]);

  return (
    <div className="zsw-singer-album-detail">
      <div className="zsw-singer-album-detail-left">
        <img
          src={`${
            picUrl
              ? picUrl + "?param=150y150"
              : "https://p2.music.126.net/HvB44MNINoLar8HFbRjIGQ==/109951165142435842.jpg?param=150y150"
          }`}
          alt=""
        />
      </div>
      <div className="zsw-singer-album-detail-right">
        <div className="zsw-singer-album-detail-title">{title}</div>
        <div className={classes}>
          {loading ? (
            <div className="zsw-singer-album-loading">
              <LoadingOutlined />
              载入中
            </div>
          ) : (
            <>
              {albumData.map((item, index) => {
                return (
                  <SingerAlbumItem
                    {...item}
                    key={item.id}
                    handleItemClick={() => handleItemClick(index)}
                    selected={
                      index === selectedIndex ||
                      playQueue[currIndex] === item.id
                    }
                    isPlayed={playQueue[currIndex] === item.id}
                    playState={playState}
                    onDbClick={() =>
                      hanldeDoubleClick(item.id, item.hasCopyRight)
                    }
                  />
                );
              })}
            </>
          )}
        </div>
        {needExpand && (
          <div
            className="zsw-singer-album-detail-expand-btn"
            onClick={() => setExpand(!expand)}
          >
            {!expand ? "查看全部50首" : "只显示10首"}
            <RightOutlined />
          </div>
        )}
      </div>
    </div>
  );
};

SingerAlbumDetail.defaultProps = {
  needExpand: true
};

const mapStateToProps = (state: UnionStateTypes) => {
  const player = state.player;
  const currIndex = player.current;

  return {
    playQueue: player.playQueue,
    currIndex,
    playState: player.playState
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setPlayDetailMap(map: Map<string, PlayDetailItem>) {
      dispatch(getSetPlayDetailMapAction(map));
    },
    pushPlayQueue(ids: string | Array<string>) {
      dispatch(getPushPlayQueueAction(ids, true));
    },
    fetchPlayUrl(id: string) {
      dispatch(fetchPlayUrl(id));
    },
    changePlayIndex(id: string) {
      dispatch(getChangePlayIndexAction(id));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(SingerAlbumDetail));

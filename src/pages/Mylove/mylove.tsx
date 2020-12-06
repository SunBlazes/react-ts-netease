import React, { useEffect, useState } from "react";
import SongSheet from "../../common/PlaylistInfo/components/songsheet";
import * as types from "./type";
import axios from "../../network";
import { match } from "react-router-dom";

// const uid = "1425924625";
// const imgUrl =
//   "https://p4.music.126.net/ydi3P1xDFrrzbXrPZIwmBA==/109951164806102901.jpg?param=200y200";
// const userName = "HolypureV";

const Mylove: React.FC<types.MyloveProps> = (props) => {
  const { userName, avatarUrl } = props;
  const _match = props.match as match<{ id: string }>;
  const [trackIds, setTrackIds] = useState<string[]>([]);

  useEffect(() => {
    let isUnmount = false;
    function parse(data: any) {
      const arr: string[] = [];
      for (let i = 0; i < data.trackIds.length; i++) {
        const item = data.trackIds[i];
        arr.push(item.id);
      }
      return arr;
    }

    async function fetchData() {
      const { data } = await axios.get(
        "/playlist/detail?id=" + _match.params.id
      );
      !isUnmount && setTrackIds(parse(data.playlist));
    }

    if (_match.params.id) {
      fetchData();
    }

    return () => {
      isUnmount = true;
    };
  }, [_match.params.id]);

  return (
    <div className="mylove">
      <div>
        <div className="mylove-top clearfix">
          <div className="profile">
            {avatarUrl && <img src={avatarUrl + "?param=200y200"} alt="" />}
          </div>
          <div className="main">
            <div className="panel-1">
              <span className="tag">歌单</span>
              <span className="title">我喜欢的音乐</span>
            </div>
            <div className="panel-2">
              <span className="prefix">创作者名称: </span>
              <span className="name">{userName}</span>
            </div>
          </div>
        </div>
        <div className="mylove-playlist">
          <SongSheet trackIds={trackIds} keywords="" show={true} />
        </div>
      </div>
    </div>
  );
};
export default React.memo(Mylove);

import React, { useState } from "react";
import SearchInput from "../SearchInput";
import SongSheet from "./components/songsheet";
import Comments from "../comments";

type currentType = "playlist" | "comments" | "subscribers";

const PlaylistInfo: React.FC<PlaylistInfoProps> = (props) => {
  const [current, setCurrent] = useState<currentType>("playlist");
  const [keywords, setKeywords] = useState("");
  const { trackIds, playlistId } = props;

  function itemClick(curr: currentType) {
    setCurrent(curr);
  }

  function handleInputChange(keywords: string) {
    setKeywords(keywords);
  }

  return (
    <div className="playlist-info">
      <ul className="playlist-info-nav">
        <li
          onClick={() => itemClick("playlist")}
          className={current === "playlist" ? "sele" : ""}
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
          onClick={() => itemClick("subscribers")}
          className={current === "subscribers" ? "sele" : ""}
        >
          收藏者
        </li>
        {current === "playlist" && (
          <li style={{ float: "right" }} className="search">
            <SearchInput
              className="playlist-info-search"
              placeholder="搜索歌单音乐"
              onChange={handleInputChange}
            />
          </li>
        )}
      </ul>
      <SongSheet
        trackIds={trackIds}
        keywords={keywords}
        show={current === "playlist"}
      />
      {current === "comments" && <Comments type="playlist" id={playlistId} />}
    </div>
  );
};

export default React.memo(PlaylistInfo);

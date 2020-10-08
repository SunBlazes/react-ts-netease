import React from "react";
import { PlayCircleOutlined, RightOutlined } from "@ant-design/icons";
import { parseDate } from "../../utils";

const OfficialRankItem: React.FC<OfficialRankItemProps> = (props) => {
  const { picUrl, tracks, updateTime, onClick } = props;

  function handleItemClick() {
    onClick && onClick();
  }

  return (
    <div className="official-rank-item">
      <div
        className="official-rank-item-top"
        style={{
          backgroundImage: `url(${picUrl}?param=300y100)`
        }}
      >
        <div
          className="official-rank-item-left-overlay"
          onClick={handleItemClick}
        >
          <PlayCircleOutlined />
        </div>
      </div>
      <div className="official-rank-item-bottom">
        {tracks.map((track, index) => {
          return (
            <div className="official-rank-item-bottom-item" key={index}>
              <div className="official-rank-item-bottom-item-index">
                {index + 1}
              </div>
              <div className="official-rank-item-bottom-item-song-name">
                {track.first}
              </div>
              <div className="official-rank-item-bottom-item-singer-name">
                {track.second}
              </div>
            </div>
          );
        })}
        <div className="official-rank-item-bottom-btn">
          <span style={{ float: "left" }}>
            {parseDate("mm月dd日更新", updateTime)}
          </span>
          <span style={{ float: "right" }} onClick={handleItemClick}>
            查看全部
            <RightOutlined />
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OfficialRankItem);

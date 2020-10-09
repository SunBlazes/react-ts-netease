import React from "react";
import { VideoCameraOutlined } from "@ant-design/icons";

const SingerMVItem: React.FC<SingerMVItemProps> = (props) => {
  const { playCount, name, duration, picUrl, onClick } = props;

  return (
    <div className="zsw-singer-mv-item" onClick={onClick}>
      <div>
        <img src={`${picUrl + "?param=160y90"}`} alt="" />
        <span className="play-count">
          <VideoCameraOutlined />
          {playCount}
        </span>
        <span className="duration">{duration}</span>
      </div>
      <p>{name}</p>
    </div>
  );
};

export default React.memo(SingerMVItem);

import React from "react";
import { parsePlayCount } from "../../utils";
import { CustomerServiceOutlined, PlayCircleOutlined } from "@ant-design/icons";
import Lazyload from "../Lazyload";

const PlayListItem: React.FC<PlayListItemProps> = (props) => {
  const { playCount, picUrl, onClick, name, copywriter } = props;

  return (
    <div onClick={onClick} className="playlist-item">
      <Lazyload src={picUrl} className={copywriter ? "tran" : ""} />
      {playCount && (
        <div className="play-count">
          <CustomerServiceOutlined />
          {parsePlayCount(playCount)}
        </div>
      )}
      {name && <div className="description">{name}</div>}
      <div className="play-icon">
        <PlayCircleOutlined />
      </div>
      {copywriter && <div className="copywriter">{copywriter}</div>}
    </div>
  );
};

export default React.memo(PlayListItem);

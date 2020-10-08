import React from "react";
import { parsePlayCount } from "../../utils";

const SimiPlaylistItem: React.FC<ISimiPlaylistItem> = (props) => {
  const { picUrl, name, playCount, onClick, id } = props;

  function handleClick() {
    onClick && onClick(id);
  }

  return (
    <div className="simi-playlist-item" onClick={handleClick}>
      <div className="simi-playlist-item-left">
        <img src={picUrl} alt="" />
      </div>
      <div className="simi-playlist-item-right">
        <p className="simi-playlist-item-right-name">{name}</p>
        <p className="simi-playlist-item-right-playcount">
          {parsePlayCount(playCount)}
        </p>
      </div>
    </div>
  );
};

export default React.memo(SimiPlaylistItem);

import React from "react";
import {
  HeartOutlined,
  DownloadOutlined,
  SoundFilled
} from "@ant-design/icons";
import classnames from "classnames";

const SingerAlbumItem: React.FC<SingerAlbumItemProps> = (props) => {
  const {
    selected,
    handleItemClick,
    name,
    alia,
    duration,
    index,
    hasCopyRight,
    playState,
    isPlayed,
    onDbClick
  } = props;

  const classes = classnames("zsw-singer-album-item", {
    selected
  });

  return (
    <div
      className={classes}
      onClick={handleItemClick}
      onDoubleClick={onDbClick}
    >
      <div className="zsw-singer-album-item-index">
        {hasCopyRight ? (
          isPlayed ? (
            <SoundFilled className={`${playState ? "play" : "pause"}`} />
          ) : (
            index
          )
        ) : (
          "无"
        )}
      </div>
      <HeartOutlined />
      <DownloadOutlined />
      <div className="zsw-singer-album-item-text">
        <span className="zsw-singer-album-item-name">{name}</span>
        {alia && <span className="zsw-singer-album-item-alia">({alia})</span>}
      </div>
      <span className="zsw-singer-album-item-duration">{duration}</span>
    </div>
  );
};

export default React.memo(SingerAlbumItem);

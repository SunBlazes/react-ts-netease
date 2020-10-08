import React from "react";
import classnames from "classnames";
import WillPlayTable from "./willPlayTable";

const WillPlayList: React.FC<WillPlayListProps> = (props) => {
  const { show } = props;
  const classes = classnames("will-play-list", {
    show
  });
  return (
    <div className={classes}>
      <div className="will-play-list-title">
        <div className="will-play-list-title-center">
          <div className="will-play-list-title-playlist sele">播放列表</div>
          <div className="will-play-list-title-history">历史记录</div>
        </div>
      </div>
      <WillPlayTable />
    </div>
  );
};

export default React.memo(WillPlayList);

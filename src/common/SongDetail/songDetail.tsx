import React, { useState } from "react";
import { connect } from "react-redux";
import { UnionStateTypes } from "../../store";
import { CSSTransition } from "react-transition-group";
import { ArrowsAltOutlined } from "@ant-design/icons";
import SongDetailContent from "./songDetailContent";

const SongDetail: React.FC<SongDetailProps> = (props) => {
  const { songDetail, current } = props;
  const [contentShow, setContentShow] = useState(false);

  return (
    <CSSTransition
      in={current !== -1}
      timeout={200}
      mountOnEnter
      classNames={{
        enter: "animate__animated",
        enterActive: "animate__fadeIn",
        exit: "animate__animated",
        exitActive: "animate__fadeOut"
      }}
      unmountOnExit
    >
      <div className="zsw-song-detail">
        <div className="zsw-song-detail-left">
          <img
            src={songDetail?.picUrl}
            alt=""
            className="zsw-song-detail-img"
          />
          <div
            className="zsw-song-detail-enlarge"
            onClick={() => setContentShow(true)}
          >
            <ArrowsAltOutlined />
          </div>
        </div>
        <div className="zsw-song-detail-info">
          <p>{songDetail?.name}</p>
          <p className="zsw-song-detail-info-singername">
            {songDetail?.singers.map((singer) => {
              return <span key={singer.id}>{singer.name}</span>;
            })}
          </p>
        </div>
        {songDetail && (
          <SongDetailContent
            songDetail={songDetail}
            show={contentShow}
            hide={setContentShow}
          />
        )}
      </div>
    </CSSTransition>
  );
};

const mapStateToProps = (
  state: UnionStateTypes
): { current: number; songDetail?: PlayDetailItem } => {
  const player = state.player;
  const id = player.playQueue[player.current];
  const item = player.playDetailMap.get(id);

  return {
    current: player.current,
    songDetail: item
  };
};

export default connect(mapStateToProps)(React.memo(SongDetail));

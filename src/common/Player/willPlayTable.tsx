import React from "react";
import { Table } from "antd";
import { connect } from "react-redux";
import { UnionStateTypes } from "../../store";
import { fetchPlayUrl, getChangePlayIndexAction } from "./store";
import { SoundFilled, DeleteOutlined } from "@ant-design/icons";

const WillPLayTable: React.FC<WillPlayTableProps> = (props) => {
  const {
    willPlayQueue,
    fetchPlayUrl,
    changePlayIndex,
    current,
    playState
  } = props;

  function hanldeDoubleClick(id: string) {
    fetchPlayUrl(id);
    changePlayIndex(id);
  }

  return (
    <>
      <div className="will-play-list-tips">
        <div className="will-play-list-total">共{willPlayQueue.length}首</div>
        <div className="will-play-list-clear-all">
          <DeleteOutlined />
          清空
        </div>
      </div>
      <Table
        dataSource={willPlayQueue}
        className="will-play-list-content"
        showHeader={false}
        rowKey={(record) => record.id}
        pagination={false}
        size="small"
        showSorterTooltip={false}
        scroll={{ y: 485 }}
        onRow={(record) => {
          return {
            onDoubleClick: () => hanldeDoubleClick(record.id)
          };
        }}
      >
        <Table.Column
          width={50}
          className="will-play-list-play-state"
          render={(value: any, record: WillPlayItem, index) => {
            return current === record.id ? (
              <SoundFilled
                className={`will-play-list-${playState ? "play" : "pause"}`}
              />
            ) : (
              <span></span>
            );
          }}
        />
        <Table.Column
          dataIndex="name"
          width={300}
          className="will-play-list-name"
        />
        <Table.Column
          dataIndex="singerName"
          className="will-play-list-singername"
        />
        <Table.Column
          dataIndex="duration"
          className="will-play-list-duration"
        />
      </Table>
    </>
  );
};

const mapStateToProps = (
  state: UnionStateTypes
): {
  willPlayQueue: Array<WillPlayItem>;
  current: string;
  playState: boolean;
} => {
  const player = state.player;
  const current = player.current;

  return {
    willPlayQueue: player.willPlayQueue,
    current: player.playQueue[current],
    playState: player.playState
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
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
)(React.memo(WillPLayTable));

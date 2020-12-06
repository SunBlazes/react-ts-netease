import React, { useContext } from "react";
import { Table, message } from "antd";
import * as types from "./types";
import {
  HeartOutlined,
  DownloadOutlined,
  SoundFilled
} from "@ant-design/icons";
import { connect } from "react-redux";
import {
  getPushPlayQueueAction,
  fetchPlayUrl,
  getChangePlayIndexAction
} from "../../common/Player/store";
import { UnionStateTypes } from "../../store";
import { useHistory } from "react-router-dom";
import { SetHistoryStackContext } from "../../pages/Home";

const AlbumSongs: React.FC<types.AlbumSongsProps> = (props) => {
  const {
    loading,
    songs,
    current,
    playState,
    pushPlayQueue,
    fetchPlayUrl,
    changePlayIndex,
    willPlaylistId
  } = props;
  const context = useContext(SetHistoryStackContext);
  const history = useHistory();

  function renderIndex(value: any, record: ISearchOfSongItem) {
    return (
      <div className="index">
        {!record.hasCopyRight ? (
          "无"
        ) : record.id === current ? (
          <SoundFilled className={`${playState ? "play" : ""}`} />
        ) : (
          <span>{value}</span>
        )}
      </div>
    );
  }

  function renderPop(value: any) {
    return (
      <div className="pop">
        <div className="pop-inner" style={{ width: value + "%" }}></div>
      </div>
    );
  }

  function handleDoubleClick(id: string, hasCopyRight: boolean) {
    if (!hasCopyRight)
      return message.error({
        content: "因合作方要求，该资源暂时下架>_<"
      });
    if (willPlaylistId.indexOf(id) === -1) {
      pushPlayQueue(
        songs.map((song) => song.id),
        id
      );
    }
    fetchPlayUrl(id);
    changePlayIndex(id);
  }

  function renderManipulation() {
    return (
      <div className="steer">
        <HeartOutlined />
        <DownloadOutlined />
      </div>
    );
  }

  function toSingerDetail(id: string) {
    if (!id) return;
    context.setHistoryStack("push", "singerDetail");
    history.push("/singerDetail/" + id);
  }

  function toAlbum(id: string) {
    if (!id) return;
    context.setHistoryStack("push", "album");
    history.push("/album/" + id);
  }

  return (
    <div className="album-songs">
      <Table
        bordered
        pagination={false}
        rowKey={(record) => record.index}
        size="small"
        showSorterTooltip={false}
        loading={loading}
        dataSource={songs}
        onRow={(record) => {
          return {
            onDoubleClick: () =>
              handleDoubleClick(record.id, record.hasCopyRight)
          };
        }}
      >
        <Table.Column
          title=""
          width={40}
          align="right"
          dataIndex="index"
          render={renderIndex}
        />
        <Table.Column title="操作" width={60} render={renderManipulation} />
        <Table.Column title="音乐标题" dataIndex="name" ellipsis />
        <Table.Column
          title="歌手"
          dataIndex="singers"
          ellipsis
          render={(value: ISingerInfo[]) => {
            return value.map((item) => (
              <span
                key={item.id}
                className="singer-name"
                onClick={() => toSingerDetail(item.id)}
              >
                {item.name}
              </span>
            ));
          }}
        />
        <Table.Column
          title="专辑"
          dataIndex="album"
          ellipsis
          render={(value: any, record: ISongSheetItem) => {
            return (
              <span
                onClick={() => toAlbum(record.albumId)}
                className="album-name"
              >
                {record.album}
              </span>
            );
          }}
        />
        <Table.Column title="时长" width={150} dataIndex="duration" />
        <Table.Column
          title="热度"
          width={120}
          dataIndex="pop"
          render={renderPop}
        />
      </Table>
    </div>
  );
};

const mapStateToProps = (state: UnionStateTypes) => {
  const player = state.player;
  const current = player.current;

  return {
    current: player.playQueue[current],
    playState: player.playState,
    willPlaylistId: player.willplaylistId
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    pushPlayQueue(ids: string | Array<string>, playlistId: string) {
      dispatch(getPushPlayQueueAction(ids, true, playlistId));
    },
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
)(React.memo(AlbumSongs));

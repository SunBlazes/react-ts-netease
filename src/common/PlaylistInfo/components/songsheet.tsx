import React, { useEffect, useState, useRef } from "react";
import { Table, message } from "antd";
import axios from "../../../network";
import {
  HeartOutlined,
  DownloadOutlined,
  SoundFilled
} from "@ant-design/icons";
import { parseTime, mergeSingerNames, parseCopyright } from "../../../utils";
import { connect } from "react-redux";
import {
  getSetPlayDetailMapAction,
  getPushPlayQueueAction,
  fetchPlayUrl,
  getChangePlayIndexAction
} from "../../Player/store";
import { UnionStateTypes } from "../../../store";

const SongSheet: React.FC<SongSheetProps> = (props) => {
  const {
    trackIds,
    keywords,
    show,
    setPlayDetailMap,
    pushPlayQueue,
    fetchPlayUrl,
    changePlayIndex,
    current,
    playState,
    willPlaylistId
  } = props;
  const trackIdsRef = useRef([...trackIds]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<Array<ISongSheetItem>>([]);
  const tableDataRef = useRef<Array<ISongSheetItem>>();

  useEffect(() => {
    let isUnmount = false;
    const trackids: Array<string> = [];
    function parseSong(song: any, index: number) {
      const {
        al: { name, picUrl },
        ar,
        id,
        dt,
        noCopyrightRcmd,
        fee
      } = song;
      // const {
      //   data: { success }
      // } = await axios.get(`/check/music?id=${id}`);
      const copyright = parseCopyright(noCopyrightRcmd, fee);
      if (copyright) {
        trackids.push(id);
      }
      return {
        duration: parseTime(dt),
        singerName: mergeSingerNames(ar),
        id,
        index: index.toString().padStart(2, "0"),
        album: name,
        picUrl,
        name: song.name,
        hasCopyRight: copyright
      };
    }
    async function fetchSongsInfo() {
      setTableData([]);
      if (trackIds && trackIds.length) {
        !isUnmount && setLoading(true);
        const idsStr = trackIds.join(",");
        const { data } = await axios.get("/song/detail?ids=" + idsStr);
        console.log(data);
        const songs = data.songs as Array<any>;
        const _tableData = [];
        const dispatchedMap = new Map<string, PlayDetailItem>();
        for (let i = 0; i < songs.length; i++) {
          const parsedSong = parseSong(songs[i], i + 1);
          if (parsedSong.hasCopyRight) {
            const song: PlayDetailItem = Object.assign({}, parsedSong, {
              alia: songs[i].alia.join(",")
            });
            dispatchedMap.set(parsedSong.id, song);
          }
          _tableData.push(parsedSong);
        }
        trackIdsRef.current = trackids;
        !isUnmount && setTableData(_tableData);
        tableDataRef.current = _tableData;
        !isUnmount && setLoading(false);
        setPlayDetailMap(dispatchedMap);
      }
    }

    fetchSongsInfo();

    return () => {
      isUnmount = true;
    };
  }, [trackIds, setPlayDetailMap]);

  useEffect(() => {
    if (tableDataRef.current && tableDataRef.current.length) {
      const _tableData: ISongSheetItem[] = [];
      for (let i = 0; i < tableDataRef.current.length; i++) {
        const { name, album, singerName } = tableDataRef.current[i];
        if (
          name.includes(keywords) ||
          album.includes(keywords) ||
          singerName.includes(keywords)
        ) {
          _tableData.push(tableDataRef.current[i]);
        }
      }
      setTableData(_tableData);
    }
    // eslint-disable-next-line
  }, [keywords]);

  function renderManipulation() {
    return (
      <div className="manipulation">
        <HeartOutlined />
        <DownloadOutlined />
      </div>
    );
  }

  function handleDoubleClick(id: string, hasCopyRight: boolean) {
    if (!hasCopyRight)
      return message.error({
        content: "因合作方要求，该资源暂时下架>_<"
      });
    if (willPlaylistId.indexOf(id) === -1) {
      pushPlayQueue(trackIdsRef.current, id);
    }
    fetchPlayUrl(id);
    changePlayIndex(id);
  }

  return (
    <>
      <Table
        bordered
        dataSource={tableData}
        pagination={false}
        rowKey={(record) => record.index}
        className={`songsheet-table ${show ? "show" : ""}`}
        size="small"
        showSorterTooltip={false}
        loading={loading}
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
          render={(value: any, record: ISongSheetItem, index) => (
            <>
              {!record.hasCopyRight ? (
                <span>无</span>
              ) : record.id === current ? (
                <SoundFilled className={`${playState ? "play" : ""}`} />
              ) : (
                <span>{(index + 1).toString().padStart(2, "0")}</span>
              )}
            </>
          )}
        />
        <Table.Column title="操作" render={renderManipulation} width={80} />
        <Table.Column
          dataIndex="name"
          title="音乐标题"
          width={300}
          ellipsis
          sorter={(a: ISongSheetItem, b: ISongSheetItem) => {
            return a.name !== b.name ? (a.name > b.name ? 1 : -1) : 0;
          }}
        />
        <Table.Column
          dataIndex="singerName"
          title="歌手"
          ellipsis
          width={200}
          sorter={(a: ISongSheetItem, b: ISongSheetItem) => {
            return a.singerName !== b.singerName
              ? a.singerName > b.singerName
                ? 1
                : -1
              : 0;
          }}
        />
        <Table.Column
          dataIndex="album"
          title="专辑"
          sorter={(a: ISongSheetItem, b: ISongSheetItem) => {
            return a.album !== b.album ? (a.album > b.album ? 1 : -1) : 0;
          }}
          ellipsis
          width={200}
        />
        <Table.Column
          dataIndex="duration"
          title="时长"
          sorter={(a: ISongSheetItem, b: ISongSheetItem) => {
            return a.duration !== b.duration
              ? a.duration > b.duration
                ? 1
                : -1
              : 0;
          }}
          width={100}
        />
      </Table>
    </>
  );
};

SongSheet.defaultProps = {
  clickAndPushAll: true
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
    setPlayDetailMap(map: Map<string, PlayDetailItem>) {
      dispatch(getSetPlayDetailMapAction(map));
    },
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
)(React.memo(SongSheet));

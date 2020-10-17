import React, { useState, useEffect, useRef, useCallback } from "react";
import { Table, message } from "antd";
import axios from "../../network";
import classnames from "classnames";
import { parseTime, mergeSingerNames, parseCopyright } from "../../utils";
import {
  HeartOutlined,
  DownloadOutlined,
  SoundFilled
} from "@ant-design/icons";
import { PaginationProps } from "antd/es/pagination";
import { connect } from "react-redux";
import { UnionStateTypes } from "../../store";
import {
  getSetPlayDetailMapAction,
  getPushPlayQueueAction,
  fetchPlayUrl,
  getChangePlayIndexAction,
  getChangePlayStateAction
} from "../../common/Player/store";
import ResultOfPagination from "./resultOfPagination";

export interface IQueryParams {
  page: number;
  limit: number;
}

const ResultOfSongs: React.FC<ResultOfSongsProps> = (props) => {
  const {
    keywords,
    setLoading,
    setSearchCount,
    current,
    playState,
    setPlayDetailMap,
    pushPlayQueue,
    fetchPlayUrl,
    changePlayIndex,
    changePlayState,
    playQueue,
    urlMap
  } = props;
  const [songs, setSongs] = useState<ISearchOfSongItem[]>([]);
  const [show, setShow] = useState(false);
  const classes = classnames("result-of-songs", {
    hidden: !show
  });
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1
  });
  const map = useRef<Map<string, PlayDetailItem>>(
    new Map<string, PlayDetailItem>()
  );
  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 0,
    limit: 100
  });

  const handlePageSizeChange = useCallback((page: number) => {
    setQueryParams((data) => {
      return {
        page: page - 1,
        limit: data.limit
      };
    });
  }, []);

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

  function handleDoubleClick(record: ISearchOfSongItem) {
    if (!record.hasCopyRight) {
      return message.error({
        content: "因合作方要求，该资源暂时下架>_<"
      });
    }
    if (current === record.id && playState === false) {
      return changePlayState(true);
    } else if (current === record.id) return;
    if (playQueue.indexOf(record.id) !== -1) {
      if (!urlMap.get(record.id)) {
        fetchPlayUrl(record.id);
      }
      changePlayIndex(record.id);
    } else {
      pushPlayQueue(record.id);
      fetchPlayUrl(record.id);
      changePlayIndex(record.id);
    }
  }

  useEffect(() => {
    function returnUrl() {
      const { page, limit } = queryParams;
      const offset = page * limit;
      return `/cloudsearch?keywords=${keywords}&offset=${offset}&limit=${limit}`;
    }
    function parseData(songs: any[]) {
      console.log(songs);
      const _arr: ISearchOfSongItem[] = [];

      for (let i = 0; i < songs.length; i++) {
        const {
          al: { name, picUrl },
          ar,
          id,
          dt,
          noCopyrightRcmd,
          alia,
          pop,
          fee
        } = songs[i];
        const copyright = parseCopyright(noCopyrightRcmd, fee);
        const parsedItem = {
          duration: parseTime(dt),
          singerName: mergeSingerNames(ar),
          id,
          index: (i + 1).toString().padStart(2, "0"),
          album: name,
          picUrl,
          name: songs[i].name,
          hasCopyRight: copyright,
          alia: alia.join(",")
        };
        if (copyright) {
          map.current.set(id, parsedItem);
        }
        _arr.push(Object.assign({}, parsedItem, { pop }));
      }

      return _arr;
    }
    async function fetchData() {
      map.current = new Map<string, PlayDetailItem>();
      setSongs([]);
      setShow(false);
      setLoading(true);
      const { data } = await axios.get(returnUrl());
      setPagination({
        total: data.result.songCount
      });
      setSearchCount(data.result.songCount);
      setSongs(parseData(data.result.songs));
      setPlayDetailMap(map.current);
      setLoading(false);
      setShow(true);
    }

    if (keywords) {
      fetchData();
    }
  }, [keywords, queryParams, setPlayDetailMap, setLoading, setSearchCount]);

  function renderPop(value: any) {
    return (
      <div className="pop">
        <div className="pop-inner" style={{ width: value + "%" }}></div>
      </div>
    );
  }

  function renderManipulation() {
    return (
      <div className="steer">
        <HeartOutlined />
        <DownloadOutlined />
      </div>
    );
  }

  return (
    <div className={classes}>
      <Table
        size="small"
        bordered
        dataSource={songs}
        rowKey={(record) => record.id}
        pagination={false}
        onRow={(record) => {
          return {
            onDoubleClick: () => handleDoubleClick(record)
          };
        }}
      >
        <Table.Column
          title=""
          width={65}
          dataIndex="index"
          render={renderIndex}
        />
        <Table.Column title="操作" width={65} render={renderManipulation} />
        <Table.Column title="音乐标题" ellipsis dataIndex="name" />
        <Table.Column title="歌手" ellipsis dataIndex="singerName" />
        <Table.Column title="专辑" ellipsis dataIndex="album" />
        <Table.Column title="时长" width={100} dataIndex="duration" />
        <Table.Column
          title="热度"
          width={120}
          dataIndex="pop"
          render={renderPop}
        />
      </Table>
      <ResultOfPagination
        attrs={pagination}
        handlePageSizeChange={handlePageSizeChange}
        defaultPageSize={100}
      />
    </div>
  );
};

const mapStateToProps = (state: UnionStateTypes) => {
  const player = state.player;
  const current = player.current;

  return {
    current: player.playQueue[current],
    playState: player.playState,
    playQueue: player.playQueue,
    urlMap: player.playUrlMap
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setPlayDetailMap(map: Map<string, PlayDetailItem>) {
      dispatch(getSetPlayDetailMapAction(map));
    },
    pushPlayQueue(ids: string) {
      dispatch(getPushPlayQueueAction(ids, false));
    },
    fetchPlayUrl(id: string) {
      dispatch(fetchPlayUrl(id));
    },
    changePlayIndex(id: string) {
      dispatch(getChangePlayIndexAction(id));
    },
    changePlayState(flag: boolean) {
      dispatch(getChangePlayStateAction(flag));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(ResultOfSongs));

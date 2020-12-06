import React, { useState, useEffect, useContext } from "react";
import axios from "../../network";
import { PaginationProps } from "antd/es/pagination";
import ResultOfPagination from "./resultOfPagination";
import classnames from "classnames";
import { SetHistoryStackContext } from "../Home";
import { useHistory } from "react-router-dom";

export interface IQueryParams {
  page: number;
  limit: number;
}

const ResultOfPlaylists: React.FC<ResultOfPlaylistsProps> = (props) => {
  const { setLoading, setSearchCount, keywords } = props;
  const [playlists, setPlaylists] = useState<ResultOfPlaylistItem[]>([]);
  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 0,
    limit: 20
  });
  const [show, setShow] = useState(false);
  const classes = classnames("result-of-playlists", {
    hidden: !show
  });
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1
  });
  const context = useContext(SetHistoryStackContext);
  const history = useHistory();

  function handleItemClick(id: string) {
    context.setHistoryStack("push", "playlist");
    history.push("/playlist/" + id);
  }

  function handlePageSizeChange(page: number) {
    setQueryParams((data) => {
      return {
        page: page - 1,
        limit: data.limit
      };
    });
  }

  useEffect(() => {
    let isUnmount = false;
    function parsePlaylists(playlists: any[]) {
      const _arr: ResultOfPlaylistItem[] = [];
      if (!(playlists instanceof Array)) return [];
      for (let i = 0; i < playlists.length; i++) {
        const item = playlists[i];
        _arr.push({
          id: item.id,
          name: item.name,
          picUrl: item.coverImgUrl,
          total: item.trackCount + "首",
          creatorName: "by " + item.creator.nickname
        });
      }

      return _arr;
    }
    function returnUrl() {
      const { page, limit } = queryParams;
      const offset = page * limit;
      return `/cloudsearch?keywords=${keywords}&offset=${offset}&limit=${limit}&type=1000`;
    }
    async function fetchData() {
      setShow(false);
      setPlaylists([]);
      setLoading(true);
      const { data } = await axios.get(returnUrl());
      !isUnmount && setPlaylists(parsePlaylists(data.result.playlists));
      setSearchCount(data.result.playlistCount);
      setPagination({
        total: data.result.playlistCount
      });
      setLoading(false);
      setShow(true);
    }

    if (keywords) {
      fetchData();
    }

    return () => {
      isUnmount = true;
    };
  }, [keywords, queryParams, setLoading, setSearchCount]);

  return (
    <div className={classes}>
      {playlists.map((item) => {
        return (
          <div
            className="result-of-playlists-item"
            key={item.id}
            onClick={() => handleItemClick(item.id)}
          >
            <div className="img">
              <img src={item.picUrl + "?param=50y50"} alt="" />
            </div>
            <div className="name">{item.name}</div>
            <div className="total">{item.total}</div>
            <div className="creator-name">{item.creatorName}</div>
          </div>
        );
      })}
      <ResultOfPagination
        attrs={pagination}
        handlePageSizeChange={handlePageSizeChange}
        defaultPageSize={20}
      />
    </div>
  );
};

export default React.memo(ResultOfPlaylists);

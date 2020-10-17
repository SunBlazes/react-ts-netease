import React, { useState, useEffect, useContext } from "react";
import classnames from "classnames";
import axios from "../../network";
import { PaginationProps } from "antd/es/pagination";
import ResultOfPagination from "./resultOfPagination";
import { connect } from "react-redux";
import { getChangeTypeShowAction } from "../Home/store";
import { AlbumContext } from "../Home";

export interface IQueryParams {
  page: number;
  limit: number;
}

const ResultOfAlbums: React.FC<ResultOfAlbumsProps> = (props) => {
  const { setLoading, setSearchCount, keywords, changeTypeShow } = props;
  const [albums, setAlbums] = useState<ISearchOfAlbumItem[]>([]);
  const [show, setShow] = useState(false);
  const classes = classnames("result-of-albums", {
    hidden: !show
  });
  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 0,
    limit: 15
  });
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1
  });
  const context = useContext(AlbumContext);

  function handleItemClick(id: string) {
    context.changeAlbumId(id);
    changeTypeShow("album");
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
    function parse(albums: any[]) {
      const _arr: ISearchOfAlbumItem[] = [];

      for (let i = 0; i < albums.length; i++) {
        const item = albums[i];
        _arr.push({
          id: item.id,
          name: item.name,
          picUrl: item.picUrl,
          singerName: item.artist.name
        });
      }

      return _arr;
    }
    function returnUrl() {
      const { page, limit } = queryParams;
      const offset = page * limit;
      return `/cloudsearch?keywords=${keywords}&offset=${offset}&limit=${limit}&type=10`;
    }
    async function fetchData() {
      setShow(false);
      setAlbums([]);
      setLoading(true);
      const { data } = await axios.get(returnUrl());
      setAlbums(parse(data.result.albums));
      setSearchCount(data.result.albumCount);
      setPagination({
        total: data.result.albumCount
      });
      setLoading(false);
      setShow(true);
    }
    if (keywords) {
      fetchData();
    }
  }, [keywords, queryParams, setLoading, setSearchCount]);

  return (
    <div className={classes}>
      {albums.map((item) => {
        return (
          <div
            className="result-of-albums-item"
            key={item.id}
            onClick={() => handleItemClick(item.id)}
          >
            <div className="img">
              <img src={item.picUrl + "?param=45y45"} alt="" />
            </div>
            <div className="name">{item.name}</div>
            <div className="singer-name">{item.singerName}</div>
          </div>
        );
      })}
      <ResultOfPagination
        attrs={pagination}
        handlePageSizeChange={handlePageSizeChange}
        defaultPageSize={15}
      />
    </div>
  );
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    changeTypeShow(type: showOfType) {
      dispatch(getChangeTypeShowAction(type));
    }
  };
};

export default connect(null, mapDispatchToProps)(React.memo(ResultOfAlbums));

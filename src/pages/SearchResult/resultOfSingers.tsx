import React, { useState, useEffect, useContext } from "react";
import axios from "../../network";
import ResultOfPagination from "./resultOfPagination";
import { PaginationProps } from "antd/es/pagination";
import classnames from "classnames";
import { connect } from "react-redux";
import { getChangeTypeShowAction } from "../Home/store";
import { SingerDetailContext } from "../Home";

export interface IQueryParams {
  page: number;
  limit: number;
}

const ResultOfSingers: React.FC<ResultOfSingersProps> = (props) => {
  const { setLoading, setSearchCount, keywords, changeTypeShow } = props;
  const [singers, setSingers] = useState<ISearchOfSingerItem[]>([]);
  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 0,
    limit: 20
  });
  const [show, setShow] = useState(false);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1
  });
  const classes = classnames("result-of-singers", {
    hidden: !show
  });
  const context = useContext(SingerDetailContext);

  function handleItemClick(id: string) {
    context.changeSingerId(id);
    changeTypeShow("singerDetail");
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
    function parse(artists: any[]) {
      const _arr: ISearchOfSingerItem[] = [];

      for (let i = 0; i < artists.length; i++) {
        const item = artists[i];
        _arr.push({
          id: item.id,
          name: item.name,
          picUrl: item.img1v1Url
        });
      }

      return _arr;
    }
    function returnUrl() {
      const { page, limit } = queryParams;
      const offset = page * limit;
      return `/cloudsearch?keywords=${keywords}&offset=${offset}&limit=${limit}&type=100`;
    }
    async function fetchData() {
      setShow(false);
      setSingers([]);
      setLoading(true);
      const { data } = await axios.get(returnUrl());
      setPagination({
        total: data.result.artistCount
      });
      setSearchCount(data.result.artistCount);
      !isUnmount && setSingers(parse(data.result.artists));
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
      {singers.map((item) => {
        return (
          <div
            className="result-of-singers-item"
            key={item.id}
            onClick={() => handleItemClick(item.id)}
          >
            <div className="img">
              <img src={item.picUrl + "?param=45y45"} alt="" />
            </div>
            <div className="name">{item.name}</div>
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

const mapDispatchToProps = (dispatch: any) => {
  return {
    changeTypeShow(type: showOfType) {
      dispatch(getChangeTypeShowAction(type));
    }
  };
};

export default connect(null, mapDispatchToProps)(React.memo(ResultOfSingers));

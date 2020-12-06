import React, { useState, useEffect, useContext } from "react";
import classnames from "classnames";
import axios from "../../network";
import { parseTime, mergeSingers, parsePlayCount } from "../../utils";
import { CustomerServiceOutlined } from "@ant-design/icons";
import { PaginationProps } from "antd/es/pagination";
import ResultOfPagination from "./resultOfPagination";
import { SetHistoryStackContext } from "../Home";
import { useHistory } from "react-router-dom";

export interface IQueryParams {
  page: number;
  limit: number;
}

const ResultOfMVs: React.FC<ResultOfMVsProps> = (props) => {
  const { keywords, setLoading, setSearchCount } = props;
  const [mvs, setMVs] = useState<ISearchOfMVItem[]>([]);
  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 0,
    limit: 20
  });
  const [show, setShow] = useState(false);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1
  });
  const classes = classnames("result-of-mvs", {
    hidden: !show
  });
  const context = useContext(SetHistoryStackContext);
  const history = useHistory();

  function handleItemClick(id: string) {
    context.setHistoryStack("push", "mv");
    history.push("/mv/" + id);
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
    function parseMVs(mvs: any[]) {
      const _arr: ISearchOfMVItem[] = [];
      if (!(mvs instanceof Array)) return [];
      for (let i = 0; i < mvs.length; i++) {
        const item = mvs[i];
        _arr.push({
          id: item.id,
          name: item.name,
          duration: parseTime(item.duration),
          playCount: parsePlayCount(item.playCount),
          singers: mergeSingers(item.artists),
          picUrl: item.cover
        });
      }

      return _arr;
    }
    function returnUrl() {
      const { page, limit } = queryParams;
      const offset = page * limit;
      return `/cloudsearch?keywords=${keywords}&offset=${offset}&limit=${limit}&type=1004`;
    }
    async function fetchData() {
      setShow(false);
      setLoading(true);
      setMVs([]);
      const { data } = await axios.get(returnUrl());
      !isUnmount && setMVs(parseMVs(data.result.mvs));
      setPagination({
        total: data.result.mvCount
      });
      setSearchCount(data.result.mvCount);
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
      <div className="result-of-mvs-content">
        {mvs.map((item) => {
          return (
            <div
              className="result-of-mvs-item"
              key={item.id}
              onClick={() => handleItemClick(item.id)}
            >
              <div>
                <img src={item.picUrl + "?param=199y112"} alt="" />
                <span className="duration">{item.duration}</span>
                <div className="playCount">
                  <CustomerServiceOutlined />
                  {item.playCount}
                </div>
              </div>
              <p className="name">{item.name}</p>
              <p className="singer-name">
                {item.singers.map((singer) => (
                  <span key={singer.id}>{singer.name}</span>
                ))}
              </p>
            </div>
          );
        })}
      </div>
      <ResultOfPagination
        attrs={pagination}
        handlePageSizeChange={handlePageSizeChange}
        defaultPageSize={20}
      />
    </div>
  );
};

export default React.memo(ResultOfMVs);

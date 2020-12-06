import React, { useState, useEffect, useRef, useContext } from "react";
import SingerMVItem from "./singerMVItem";
import axios from "../../network";
import classnames from "classnames";
import { LoadingOutlined } from "@ant-design/icons";
import { parseTime, parsePlayCount } from "../../utils";
import { SetHistoryStackContext } from "../Home";
import { useHistory } from "react-router-dom";

const SingerMV: React.FC<SingerMVProps> = (props) => {
  const { id, show } = props;
  const [mvs, setMVs] = useState<ISingerMVItem[]>([]);
  const classes = classnames("zsw-singer-mvs", {
    show
  });
  const [offset, setOffset] = useState(0);
  const more = useRef(true);
  const [firstRequest, setFirstRequest] = useState(false);
  const context = useContext(SetHistoryStackContext);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (show) {
      setFirstRequest(true);
    }
  }, [show]);

  useEffect(() => {
    more.current = true;
    setMVs([]);
    setOffset(0);
  }, [id]);

  useEffect(() => {
    let isUnmount = false;
    function handleScroll(e: Event) {
      const target = e.target as HTMLDivElement;
      if (!more.current) {
        el.removeEventListener("scroll", handleScroll);
      }
      if (
        target.scrollTop >= target.scrollHeight - target.offsetHeight &&
        target.scrollTop > 0
      ) {
        !isUnmount && setOffset((offset) => offset + 30);
      }
    }
    const el = document.getElementsByClassName("home-content")[0];
    if (show) {
      el.addEventListener("scroll", handleScroll);
    }

    return () => {
      isUnmount = true;
      el.removeEventListener("scroll", handleScroll);
    };
  }, [show]);

  useEffect(() => {
    function returnUrl() {
      return `/artist/mv?id=${id}&offset=${offset}&limit=30`;
    }

    function parsemvs(data: any[]) {
      const arr: ISingerMVItem[] = [];

      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        arr.push({
          name: item.name,
          duration: parseTime(item.duration),
          id: item.id,
          picUrl: item.imgurl16v9,
          playCount:
            item.playCount >= 10000
              ? parsePlayCount(item.playCount)
              : item.playCount
        });
      }

      return arr;
    }

    async function fetchData() {
      setLoading(true);
      const { data } = await axios.get(returnUrl());
      more.current = data.hasMore;
      setMVs((mvs) => mvs.concat(parsemvs(data.mvs)));
      setLoading(false);
    }

    if (id && more.current && firstRequest) {
      fetchData();
    }
  }, [id, offset, firstRequest]);

  function handleClick(id: string) {
    context.setHistoryStack("push", "mv");
    history.push("/mv/" + id);
  }

  return (
    <div className={classes}>
      {mvs.map((item) => {
        return (
          <SingerMVItem
            {...item}
            key={item.id}
            onClick={() => handleClick(item.id)}
          />
        );
      })}
      {loading && (
        <div className="zsw-singer-mvs-loading">
          <LoadingOutlined />
          载入中
        </div>
      )}
    </div>
  );
};

export default React.memo(SingerMV);

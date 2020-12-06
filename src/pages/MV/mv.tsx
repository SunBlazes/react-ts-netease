import React, { useEffect, useState, useContext } from "react";
import classnames from "classnames";
import { LeftOutlined } from "@ant-design/icons";
import Comments from "../../common/comments";
import axios from "../../network";
import { parseDate, parsePlayCount } from "../../utils";
import { match, useHistory } from "react-router-dom";
import { SetHistoryStackContext } from "../Home";

interface IMVInfo {
  name: string;
  id: string;
  playCount: string;
  publishTime: string;
  artists: any[];
}

interface MVProps {
  match: match;
}

const MV: React.FC<MVProps> = (props) => {
  const match = props.match as match<{ id: string }>;
  const classes = classnames("zsw-mv");
  const [url, setUrl] = useState("");
  const [info, setInfo] = useState<IMVInfo>();
  const history = useHistory();
  const context = useContext(SetHistoryStackContext);

  function back() {
    context.setHistoryStack("prev", "");
    history.go(-1);
  }

  useEffect(() => {
    function parseMVInfo(data: any): IMVInfo {
      return {
        name: data.name,
        artists: data.artists,
        playCount:
          data.playCount > 10000
            ? parsePlayCount(data.playCount) + "次"
            : data.playCount + "次",
        publishTime: parseDate("YYYY-mm-dd", data.publishTime),
        id: data.id
      };
    }
    async function fetchData() {
      const urlData = await axios.get("/mv/url?id=" + match.params.id);
      const url = urlData.data.data.url;
      setUrl(url);

      const infoData = await axios.get("/mv/detail?mvid=" + match.params.id);
      setInfo(parseMVInfo(infoData.data.data));
    }

    if (match.params.id) {
      fetchData();
    }
  }, [match.params.id]);

  return (
    <div className={classes}>
      <div>
        <div className="zsw-mv-top">
          <div className="zsw-mv-top-left">
            <p>
              <LeftOutlined onClick={back} />
              <span className="zsw-mv-name">{info ? info.name : ""}</span>
              {info &&
                info.artists.map((item, index) => {
                  return (
                    <React.Fragment key={item.id}>
                      <span className="zsw-mv-singer-name">{item.name}</span>
                      <span>
                        {index === info.artists.length - 1 ? "" : "/"}
                      </span>
                    </React.Fragment>
                  );
                })}
            </p>
            <video src={url} controls></video>
          </div>
          <div className="zsw-mv-introduction">
            <div className="title">MV介绍</div>
            <p>发布时间: {info ? info.publishTime : ""}</p>
            <p>播放次数: {info ? info.playCount : ""}</p>
          </div>
        </div>
        {match.params.id && <Comments type="mv" id={match.params.id} />}
      </div>
    </div>
  );
};

export default React.memo(MV);

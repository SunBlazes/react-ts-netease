import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { UnionStateTypes } from "../../store";
import classnames from "classnames";
import { LeftOutlined } from "@ant-design/icons";
import Comments from "../../common/comments";
import axios from "../../network";
import { parseDate, parsePlayCount } from "../../utils";
import { getToggleTypeShowAction, direction } from "../Home/store";
import { CSSTransition } from "react-transition-group";

interface IMVInfo {
  name: string;
  id: string;
  playCount: string;
  publishTime: string;
  artists: any[];
}

interface MVProps extends IMV {
  toggleTypeShow: (direction: direction) => void;
}

const MV: React.FC<MVProps> = (props) => {
  const { show, id, toggleTypeShow } = props;
  const classes = classnames("zsw-mv", {
    hidden: !show
  });
  const [url, setUrl] = useState("");
  const [info, setInfo] = useState<IMVInfo>();

  function back() {
    toggleTypeShow("prev");
  }

  useEffect(() => {
    if (!show) {
      setUrl("");
      setInfo(undefined);
    }
  }, [show]);

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
      const urlData = await axios.get("/mv/url?id=" + id);
      const url = urlData.data.data.url;
      setUrl(url);

      const infoData = await axios.get("/mv/detail?mvid=" + id);
      setInfo(parseMVInfo(infoData.data.data));
    }

    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <CSSTransition
      in={show === true}
      timeout={400}
      mountOnEnter
      classNames={{
        enter: "animate__animated",
        enterActive: "animate__fadeIn"
      }}
      unmountOnExit
    >
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
          {id && <Comments type="mv" id={id} />}
        </div>
      </div>
    </CSSTransition>
  );
};

const mapStateToProps = (state: UnionStateTypes) => {
  const home = state.home;
  return {
    show: home.showMap.get("mv") as boolean
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    toggleTypeShow(direction: direction) {
      dispatch(getToggleTypeShowAction(direction));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(MV));

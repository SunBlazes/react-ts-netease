import React, { useEffect, useState, useRef, useContext } from "react";
import classnames from "classnames";
import axios from "../../network";
import { LoadingOutlined } from "@ant-design/icons";
import { parseDate } from "../../utils";
import SingerRankItem from "./singerRankItem";
import { connect } from "react-redux";
import { getChangeTypeShowAction } from "../Home/store/actionCreator";
import { SingerDetailContext } from "../Home";

type currType = "华语" | "欧美" | "韩国" | "日本";

const typeMap: Map<currType, number> = new Map();
typeMap.set("华语", 1);
typeMap.set("欧美", 2);
typeMap.set("韩国", 3);
typeMap.set("日本", 4);

interface SingerRankProps extends SingerRank {
  changeShow: (currType: showOfType) => void;
}

const SingerRank: React.FC<SingerRankProps> = (props) => {
  const { show, changeShow } = props;
  const classes = classnames("total-singer-rank", {
    show
  });
  const [currType, setCurrType] = useState<currType>("华语");
  const [singerData, setSingerData] = useState<ISingerItemInfo[]>([]);
  const totalScore = useRef(0);
  const [updateTime, setUpdateTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const singerDetailContext = useContext(SingerDetailContext);

  function hanldeTabItemClick(name: currType) {
    setCurrType(name);
  }

  function handleRankItemClick(id: string) {
    changeShow("singerDetail");
    singerDetailContext.changeSingerId(id);
  }

  useEffect(() => {
    let isUnmount = false;
    function parseArtist(artists: any[]) {
      const arr: ISingerItemInfo[] = [];
      for (let i = 0; i < artists.length; i++) {
        const item = artists[i];
        if (i === 0) {
          totalScore.current = item.score;
        }
        arr.push({
          name: item.name,
          score: item.score,
          id: item.id,
          picUrl: item.picUrl,
          lastRank: item.lastRank
        });
      }
      return arr;
    }
    async function fetchData() {
      !isUnmount && setLoading(true);
      const { data } = await axios.get(
        `/toplist/artist?type=${typeMap.get(currType)}`
      );
      const list = data.list;
      !isUnmount && setUpdateTime(list.updateTime);
      const artists = list.artists as any[];
      !isUnmount && setSingerData(parseArtist(artists));
      !isUnmount && setLoading(false);
    }
    fetchData();

    return () => {
      isUnmount = true;
    };
  }, [currType]);

  return (
    <div className={classes}>
      <div>
        <div className="total-singer-rank-title">云音乐歌手榜</div>
        <div className="total-singer-rank-tab">
          <div
            className={`total-singer-rank-tab-item ${
              currType === "华语" ? "selected" : ""
            }`}
            onClick={() => hanldeTabItemClick("华语")}
          >
            华语
          </div>
          <div
            className={`total-singer-rank-tab-item ${
              currType === "欧美" ? "selected" : ""
            }`}
            onClick={() => hanldeTabItemClick("欧美")}
          >
            欧美
          </div>
          <div
            className={`total-singer-rank-tab-item ${
              currType === "韩国" ? "selected" : ""
            }`}
            onClick={() => hanldeTabItemClick("韩国")}
          >
            韩国
          </div>
          <div
            className={`total-singer-rank-tab-item ${
              currType === "日本" ? "selected" : ""
            }`}
            onClick={() => hanldeTabItemClick("日本")}
          >
            日本
          </div>
          {updateTime && (
            <div className="total-singer-rank-tab-updateTime">
              <span>更新时间:</span>
              {parseDate("mm月dd日", updateTime)}
            </div>
          )}
        </div>
        <div className="total-singer-rank-content">
          {loading ? (
            <div className="total-singer-rank-content-loading">
              <LoadingOutlined />
              载入中
            </div>
          ) : (
            <div>
              {singerData.map((item, index) => {
                return (
                  <SingerRankItem
                    key={item.id}
                    {...item}
                    index={index}
                    totalScore={totalScore.current}
                    onClick={() => handleRankItemClick(item.id)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    changeShow(currType: showOfType) {
      dispatch(getChangeTypeShowAction(currType));
    }
  };
};

export default connect(null, mapDispatchToProps)(React.memo(SingerRank));

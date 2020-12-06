import React, { useEffect, useState, useContext } from "react";
import classnames from "classnames";
import OfficialRankItem from "./officialRankItem";
import axios from "../../network";
import { LoadingOutlined } from "@ant-design/icons";
import PlaylistItem from "../../common/PlayListItem";
import MainTabs from "../MainTabs";
import { useHistory } from "react-router-dom";
import { SetHistoryStackContext } from "../Home";

const Rank: React.FC<RankProps> = () => {
  const classes = classnames("total-ranks");
  const [loading, setLoading] = useState(false);
  const [officialRankData, setOfficialRankData] = useState<
    Array<OfficialRankItemProps>
  >([]);
  const [globalRankData, setGlobalRankData] = useState<Array<IPlaylistItem>>(
    []
  );
  const context = useContext(SetHistoryStackContext);
  const history = useHistory();

  useEffect(() => {
    function parseOfficialRank(data: any[]) {
      const arr: OfficialRankItemProps[] = [];
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        arr.push({
          picUrl: item.coverImgUrl,
          updateTime: item.updateTime,
          id: item.id,
          tracks: item.tracks
        });
      }
      console.log(arr);
      return arr;
    }
    function parseToplist(obj: any): OfficialRankItemProps {
      return {
        updateTime: Date.now(),
        picUrl: obj.coverUrl,
        tracks: obj.artists,
        id: "",
        type: "singer"
      };
    }
    function parseGlobalRank(data: any[]) {
      const arr: IPlaylistItem[] = [];
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        arr.push({
          picUrl: item.coverImgUrl,
          id: item.id,
          name: item.name,
          playCount: item.playCount
        });
      }
      return arr;
    }
    async function fetchRankData() {
      setLoading(true);
      if (officialRankData.length === 0) {
        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });
      }
      const { data } = await axios.get("/toplist/detail");
      const list = data.list as Array<any>;
      const toplist = data.artistToplist;
      const officialData = list.slice(0, 4);
      const globalData = list.slice(4);
      setOfficialRankData(
        parseOfficialRank(officialData).concat([parseToplist(toplist)])
      );
      setGlobalRankData(parseGlobalRank(globalData));
      setLoading(false);
    }
    fetchRankData();
    // eslint-disable-next-line
  }, []);

  function handleItemClick(id: string, type?: string) {
    if (!type) {
      context.setHistoryStack("push", "playlist");
      history.push("/playlist/" + id);
      return;
    }
    return history.push("/singerRank");
  }

  return (
    <div className={classes}>
      <div>
        <MainTabs name="rank" />
        {loading ? (
          <div className="total-rank-loading">
            <LoadingOutlined />
            载入中...
          </div>
        ) : (
          <div className="total-ranks-inner">
            <div className="official-rank">
              <div className="total-ranks-title">官方榜</div>
              <div className="official-rank-content">
                {officialRankData.map((item) => {
                  return (
                    <OfficialRankItem
                      {...item}
                      key={item.id}
                      onClick={() => handleItemClick(item.id, item.type)}
                    />
                  );
                })}
              </div>
            </div>
            <div className="global-rank">
              <div className="total-ranks-title">全球榜</div>
              <div className="global-rank-content">
                {globalRankData.map((data) => {
                  return (
                    <PlaylistItem
                      {...data}
                      key={data.id}
                      onClick={() => handleItemClick(data.id)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Rank);

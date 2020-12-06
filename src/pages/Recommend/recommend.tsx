import React, { useEffect, useState, useContext } from "react";
import axios from "../../network";
import Swipe from "../../common/Swipe";
import classnames from "classnames";
import Title from "./components/title";
import PlayListItem from "../../common/PlayListItem";
import MainTabs from "../MainTabs";
import { useHistory } from "react-router-dom";
import { SetHistoryStackContext } from "../Home";
import { connect } from "react-redux";
import { UnionStateTypes } from "../../store";

interface RecommendProps {
  moreClick: () => void;
  userId: string;
}

interface IBanner {
  imageUrl: string;
}

const Recommend: React.FC<RecommendProps> = (props) => {
  const { moreClick, userId } = props;
  const [banners, setBanners] = useState<Array<string>>([]);
  const [recPlaylistItems, setRecPlaylistItems] = useState<
    Array<IPlaylistItem>
  >([]);
  const classes = classnames("recommend");
  const history = useHistory();
  const context = useContext(SetHistoryStackContext);

  function handleItemClick(id: string) {
    history.push(`/playlist/${id}`);
    context.setHistoryStack("push", "playlist");
  }

  useEffect(() => {
    function fetchBanners() {
      axios.get("/banner?type=0").then(({ data }) => {
        const banners = data.banners as Array<IBanner>;
        const _banners = [];
        for (let i = 0; i < banners.length; i++) {
          const banner = banners[i];
          _banners.push(banner.imageUrl);
        }
        setBanners(_banners);
      });
    }
    function getRecommendPlaylists() {
      axios
        .get("/personalized?limit=10&timestamp=" + Date.now())
        .then(({ data }) => {
          //  console.log(data);
          const recommend = data.result as Array<IPlaylistItem>;
          const _data = [] as Array<IPlaylistItem>;
          for (let i = 0; i < recommend.length; i++) {
            const { id, name, picUrl, playCount, copywriter } = recommend[i];
            _data.push({ id, name, picUrl, playCount, copywriter });
          }
          setRecPlaylistItems(_data);
        });
    }
    fetchBanners();
    getRecommendPlaylists();
  }, [userId]);

  return (
    <div className={classes}>
      <div>
        <MainTabs name="recommend" />
        <Swipe style={{ margin: "0 auto", marginTop: 30 }}>
          {banners.map((banner) => {
            return (
              <Swipe.Item key={banner}>
                <img src={banner} alt="" />
              </Swipe.Item>
            );
          })}
        </Swipe>
        <div className="recommend-playlists">
          <Title title="推荐歌单" moreClick={moreClick} />
          <div className="playlist-item-container">
            {recPlaylistItems.map((item) => {
              return (
                <PlayListItem
                  {...item}
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: UnionStateTypes) => {
  return {
    userId: state.header.user.userId
  };
};

export default connect(mapStateToProps)(React.memo(Recommend));

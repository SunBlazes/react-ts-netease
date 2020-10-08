import React, { useEffect, useState, useContext } from "react";
import axios from "../../network";
import Swipe from "../../common/Swipe";
import classnames from "classnames";
import Title from "./components/title";
import PlayListItem from "../../common/PlayListItem";
import { connect } from "react-redux";
import { getChangeTypeShowAction } from "../Home/store";
import { PlaylistContext } from "../Home";

interface RecommendProps {
  firstRequest?: boolean;
  show?: boolean;
  moreClick: () => void;
  changeShow: (currType: showOfType) => void;
}

interface IBanner {
  imageUrl: string;
}

const Recommend: React.FC<RecommendProps> = (props) => {
  const { firstRequest, show, moreClick, changeShow } = props;
  const [banners, setBanners] = useState<Array<string>>([]);
  const [recPlaylistItems, setRecPlaylistItems] = useState<
    Array<IPlaylistItem>
  >([]);
  const classes = classnames("recommend", {
    show
  });
  const playlistContext = useContext(PlaylistContext);

  function handleItemClick(id: string) {
    playlistContext.changePlaylistId(id);
    changeShow("playlist");
  }

  useEffect(() => {
    async function fetchBanners() {
      const { data } = await axios.get("/banner?type=0");
      const banners = data.banners as Array<IBanner>;
      const _banners = [];
      for (let i = 0; i < banners.length; i++) {
        const banner = banners[i];
        _banners.push(banner.imageUrl);
      }
      setBanners(_banners);
    }
    async function getRecommendPlaylists() {
      const { data } = await axios.get("/personalized?limit=10");
      console.log(data);
      const recommend = data.result as Array<IPlaylistItem>;
      const _data = [] as Array<IPlaylistItem>;
      for (let i = 0; i < recommend.length; i++) {
        const { id, name, picUrl, playCount, copywriter } = recommend[i];
        _data.push({ id, name, picUrl, playCount, copywriter });
      }
      setRecPlaylistItems(_data);
    }
    if (firstRequest) {
      fetchBanners();
      getRecommendPlaylists();
    }
  }, [firstRequest]);

  return (
    <div className={classes}>
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
  );
};

Recommend.defaultProps = {
  firstRequest: false,
  show: false
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    changeShow(currType: showOfType) {
      dispatch(getChangeTypeShowAction(currType));
    }
  };
};

export default connect(null, mapDispatchToProps)(React.memo(Recommend));

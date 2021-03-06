import React, { useState, useEffect, useRef, useContext } from "react";
import AllCategories from "./allCategories";
import classnames from "classnames";
import axios from "../../network";
import { LoadingOutlined } from "@ant-design/icons";
import PlaylistItem from "../../common/PlayListItem";
import { PaginationProps } from "antd/es/pagination";
import { Pagination } from "antd";
import { PlaylistContext } from "../Home";
import { connect } from "react-redux";
import { getChangeTypeShowAction } from "../Home/store";

interface IQueryParams {
  page: number;
  limit: number;
}

function toArray(obj: any) {
  const arr = [];
  for (let index in obj) {
    arr.push(obj[index]);
  }
  return arr;
}

const TotalPlaylists: React.FC<TotalPlaylistsProps> = (props) => {
  const { show, changeShow } = props;
  const classes = classnames("total-playlists", {
    show
  });
  const [categories, setCategories] = useState<CategoryType>([]);
  const [hotCategories, setHotCategories] = useState<Array<IHotCategoryItem>>(
    []
  );
  const [currCategory, setCurrCategory] = useState("全部歌单");
  const [loading, setLoading] = useState(false);
  const [playlists, setPlaylists] = useState<Array<IPlaylistItem>>([]);
  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 0,
    limit: 50
  });
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1
  });
  const defaultPagination = useRef<PaginationProps>({
    defaultCurrent: 1,
    defaultPageSize: 50,
    hideOnSinglePage: true,
    size: "small",
    showSizeChanger: false,
    onChange: handlePageSizeChange
  });
  const playlistContext = useContext(PlaylistContext);

  function handlePageSizeChange(page: number) {
    setQueryParams((data) => {
      return {
        page: page - 1,
        limit: data.limit
      };
    });
  }

  useEffect(() => {
    function parseCategoryArray(arr: Array<any>) {
      const _arr = [];
      for (let i = 0; i < arr.length; i++) {
        const arrItem = arr[i];
        const item: ICategoryItem = {
          name: arrItem.name,
          category: arrItem.category,
          hot: arrItem.hot
        };
        _arr.push(item);
      }
      return _arr;
    }

    async function fetchAllCategoriesData() {
      const { data } = await axios.get("/playlist/catlist");
      const _categories = data.categories;
      const _categoriesArr = toArray(_categories);
      const sub = data.sub as Array<any>;
      const neededArr = [];
      console.log(_categoriesArr);
      for (let i = 0; i < _categoriesArr.length; i++) {
        const arr = sub.filter((item) => item.category === i);
        const parsedArr = parseCategoryArray(arr);
        const item = {
          categoryName: _categoriesArr[i],
          arr: parsedArr
        };
        neededArr.push(item);
      }
      setCategories(neededArr);
    }

    async function fetchHotCategoriesData() {
      const { data } = await axios.get("/playlist/hot");
      const tags = data.tags as Array<any>;
      const arr = [];
      for (let i = 0; i < tags.length; i++) {
        arr.push({
          name: tags[i].name,
          id: tags[i].id
        });
      }
      setHotCategories(arr);
    }

    fetchAllCategoriesData();
    fetchHotCategoriesData();
  }, []);

  useEffect(() => {
    function fetchUrl() {
      const { page, limit } = queryParams;
      const offset = page * limit;
      if (currCategory === "全部歌单") {
        return `/top/playlist?limit=${limit}&offset=${offset}`;
      }
      return `/top/playlist?cat=${currCategory}&limit=${limit}&offset=${offset}`;
    }

    async function fetchPlaylistData() {
      setLoading(true);
      if (playlists.length === 0) {
        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });
      }
      const { data } = await axios.get(fetchUrl());
      console.log(data);
      const _playlists = data.playlists as Array<any>;
      const arr: Array<IPlaylistItem> = [];
      for (let i = 0; i < _playlists.length; i++) {
        const item = _playlists[i];
        arr.push({
          name: item.name,
          id: item.id,
          playCount: item.playCount,
          picUrl: item.coverImgUrl
        });
      }
      console.log(data.total);
      setPagination({
        total: 500
      });
      setPlaylists(arr);
      setLoading(false);
    }

    fetchPlaylistData();
    // eslint-disable-next-line
  }, [currCategory, queryParams]);

  function handleItemClick(id: string) {
    playlistContext.changePlaylistId(id);
    changeShow("playlist");
  }

  return (
    <div className={classes}>
      <div className="total-playlists-inner">
        <AllCategories
          categories={categories}
          currCategory={currCategory}
          changeCategory={setCurrCategory}
        />
        <div className="hot-categories">
          <span className="hot-categories-title">热门标签: </span>
          {hotCategories.map((item) => {
            return (
              <span
                key={item.name}
                className="hot-categories-item"
                onClick={() => setCurrCategory(item.name)}
              >
                {item.name}
              </span>
            );
          })}
        </div>
        <div className="all-playlists-inner-content">
          {loading ? (
            <div className="all-playlists-inner-content-loading">
              <LoadingOutlined />
              载入中
            </div>
          ) : (
            <div>
              {playlists.map((playlist) => {
                return (
                  <PlaylistItem
                    {...playlist}
                    onClick={() => handleItemClick(playlist.id)}
                    key={playlist.id}
                  />
                );
              })}
            </div>
          )}
          <div className="all-playlists-inner-pagination">
            <Pagination
              {...defaultPagination.current}
              {...pagination}
              style={{ display: loading ? "none" : "block" }}
            />
          </div>
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

export default connect(null, mapDispatchToProps)(React.memo(TotalPlaylists));

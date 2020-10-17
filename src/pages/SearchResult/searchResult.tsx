import React, { useState, useCallback } from "react";
import { connect } from "react-redux";
import { UnionStateTypes } from "../../store";
import classnames from "classnames";
import { LoadingOutlined } from "@ant-design/icons";
import ResultOfSongs from "./resultOfSongs";
import ResultOfSingers from "./resultOfSingers";
import ResultOfAlbums from "./resultOfAlbums";
import ResultOfMVs from "./resultOfMVs";
import ResultOfPlaylists from "./resultOfPlaylists";

type currentType = "单曲" | "歌手" | "专辑" | "MV" | "歌单";

const typeArr: currentType[] = ["单曲", "歌手", "专辑", "MV", "歌单"];

const SearchResult: React.FC<SearchResultProps> = (props) => {
  const { keywords, show } = props;
  const [curr, setCurr] = useState<currentType>("单曲");
  const [searchCount, setSearchCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const classes = classnames("search-result", {
    hidden: !show
  });

  const setCount = useCallback((num: number) => {
    setSearchCount(num);
  }, []);

  const changeLoading = useCallback((flag: boolean) => {
    setLoading(flag);
  }, []);

  return (
    <div className={classes}>
      <div className="search-result-header">
        搜索"<span>{keywords}</span>",找到{searchCount}首{curr}
      </div>
      <div className="search-result-tabs">
        {typeArr.map((item) => {
          const classes = classnames("search-result-tabs-item", {
            selected: item === curr
          });
          return (
            <div className={classes} key={item} onClick={() => setCurr(item)}>
              {item}
            </div>
          );
        })}
      </div>
      {loading && (
        <div className="search-result-loading">
          <LoadingOutlined />
          <span>载入中</span>
        </div>
      )}
      {curr === "单曲" && (
        <ResultOfSongs
          keywords={keywords}
          setSearchCount={setCount}
          setLoading={changeLoading}
        />
      )}
      {curr === "歌手" && (
        <ResultOfSingers
          keywords={keywords}
          setSearchCount={setCount}
          setLoading={changeLoading}
        />
      )}
      {curr === "专辑" && (
        <ResultOfAlbums
          keywords={keywords}
          setSearchCount={setCount}
          setLoading={changeLoading}
        />
      )}
      {curr === "MV" && (
        <ResultOfMVs
          keywords={keywords}
          setSearchCount={setCount}
          setLoading={changeLoading}
        />
      )}
      {curr === "歌单" && (
        <ResultOfPlaylists
          keywords={keywords}
          setSearchCount={setCount}
          setLoading={changeLoading}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state: UnionStateTypes) => {
  return {
    show: state.home.showMap.get("searchResult") as boolean
  };
};

export default connect(mapStateToProps)(React.memo(SearchResult));

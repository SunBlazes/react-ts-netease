import React, { useState, useCallback } from "react";
import classnames from "classnames";
import { LoadingOutlined } from "@ant-design/icons";
import ResultOfSongs from "./resultOfSongs";
import ResultOfSingers from "./resultOfSingers";
import ResultOfAlbums from "./resultOfAlbums";
import ResultOfMVs from "./resultOfMVs";
import ResultOfPlaylists from "./resultOfPlaylists";
import { match } from "react-router-dom";

interface SearchResultProps {
  match: match;
}

type currentType = "单曲" | "歌手" | "专辑" | "MV" | "歌单";

const typeArr: currentType[] = ["单曲", "歌手", "专辑", "MV", "歌单"];

const SearchResult: React.FC<SearchResultProps> = (props) => {
  const match = props.match as match<{ keywords: string }>;
  const [curr, setCurr] = useState<currentType>("单曲");
  const [searchCount, setSearchCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const classes = classnames("search-result");

  const setCount = useCallback((num: number) => {
    setSearchCount(num);
  }, []);

  const changeLoading = useCallback((flag: boolean) => {
    setLoading(flag);
  }, []);

  return (
    <div className={classes}>
      <div>
        <div className="search-result-header">
          搜索"<span>{match.params.keywords}</span>",找到{searchCount}首{curr}
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
            keywords={match.params.keywords}
            setSearchCount={setCount}
            setLoading={changeLoading}
          />
        )}
        {curr === "歌手" && (
          <ResultOfSingers
            keywords={match.params.keywords}
            setSearchCount={setCount}
            setLoading={changeLoading}
          />
        )}
        {curr === "专辑" && (
          <ResultOfAlbums
            keywords={match.params.keywords}
            setSearchCount={setCount}
            setLoading={changeLoading}
          />
        )}
        {curr === "MV" && (
          <ResultOfMVs
            keywords={match.params.keywords}
            setSearchCount={setCount}
            setLoading={changeLoading}
          />
        )}
        {curr === "歌单" && (
          <ResultOfPlaylists
            keywords={match.params.keywords}
            setSearchCount={setCount}
            setLoading={changeLoading}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(SearchResult);

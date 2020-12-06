import React, { useState, useEffect, useContext } from "react";
import * as types from "./type";
import { UserOutlined } from "@ant-design/icons";
import axios from "../../network";
import { SetHistoryStackContext } from "../../pages/Home";
import { useHistory } from "react-router-dom";

const SearchKeywords: React.FC<SearchKeywordsProps> = (props) => {
  const { value } = props;
  const [data, setData] = useState<types.ISearchSuggestions>({
    songs: [],
    albums: [],
    artists: [],
    playlists: []
  });
  const context = useContext(SetHistoryStackContext);
  const history = useHistory();

  function handleSingerClick(id: string) {
    context.setHistoryStack("push", "sinerDetail");
    history.push("/singerDetail/" + id);
  }

  function handlePlaylistClick(id: string) {
    context.setHistoryStack("push", "playlist");
    history.push("/playlist/" + id);
  }

  function handleAlbumClick(id: string) {
    context.setHistoryStack("push", "album");
    history.push("/album/" + id);
  }

  // function handleSongClick() {

  // }

  useEffect(() => {
    let isUnmount = false;
    function parseSongs(songs: any[]) {
      if (!(songs instanceof Array)) return [];
      const _arr: types.IISongItem[] = [];

      for (let i = 0; i < songs.length; i++) {
        const item = songs[i];

        _arr.push({
          name: item.name,
          singerName: (item.artists as any[])
            .map((el) => {
              return el.name;
            })
            .join(" "),
          id: item.id
        });
      }

      return _arr;
    }
    function parseAlbums(albums: any[]) {
      if (!(albums instanceof Array)) return [];
      const _arr: types.IIAlbumItem[] = [];

      for (let i = 0; i < albums.length; i++) {
        const item = albums[i];

        _arr.push({
          name: item.name,
          singerName: item.artist.name,
          id: item.id
        });
      }

      return _arr;
    }
    function parseArtists(artists: any[]) {
      if (!(artists instanceof Array)) return [];
      const _arr: types.IIArtistItem[] = [];

      for (let i = 0; i < artists.length; i++) {
        const item = artists[i];

        _arr.push({
          name: item.name,
          id: item.id
        });
      }

      return _arr;
    }
    function parsePlaylists(playlists: any[]) {
      if (!(playlists instanceof Array)) return [];
      const _arr: types.IIPlaylistItem[] = [];

      for (let i = 0; i < playlists.length; i++) {
        const item = playlists[i];

        _arr.push({
          name: item.name,
          id: item.id
        });
      }

      return _arr;
    }
    async function fetchData() {
      const { data } = await axios.get("/search/suggest?keywords=" + value);
      // !isUnmount &&
      //   setData({
      //     playlists: parsePlaylists(data.result.playlists),
      //     songs: parseSongs(data.result.songs),
      //     albums: parseAlbums(data.result.albums),
      //     artists: parseArtists(data.result.artists)
      //   });
      !isUnmount &&
        setData({
          playlists: parsePlaylists(data.result.playlists),
          songs: [],
          albums: parseAlbums(data.result.albums),
          artists: parseArtists(data.result.artists)
        });
    }
    fetchData();

    return () => {
      isUnmount = true;
    };
  }, [value]);

  return (
    <div className="search-keywords">
      <div className="search-keywords-title">
        搜“<span>{value}</span>”相关的结果
      </div>
      {data.artists.length !== 0 && (
        <div className="search-keywords-item">
          <div className="search-keywords-item-title">
            <UserOutlined />
            歌手
          </div>
          {data.artists.map((item) => {
            return (
              <div
                className="search-item"
                key={item.id}
                onClick={() => handleSingerClick(item.id)}
              >
                {item.name}
              </div>
            );
          })}
        </div>
      )}
      {/* {data.songs.length !== 0 && (
        <div className="search-keywords-item">
          <div className="search-keywords-item-title">
            <i className="iconfont icon-music_note" />
            单曲
          </div>
          {data.songs.map((item) => {
            return (
              <div className="search-item" key={item.id}>
                {item.name + "-" + item.singerName}
              </div>
            );
          })}
        </div>
      )} */}
      {data.albums.length !== 0 && (
        <div className="search-keywords-item">
          <div className="search-keywords-item-title">
            <i className="iconfont icon-changpian1" />
            专辑
          </div>
          {data.albums.map((item) => {
            return (
              <div
                className="search-item"
                key={item.id}
                onClick={() => handleAlbumClick(item.id)}
              >
                {item.name + "-" + item.singerName}
              </div>
            );
          })}
        </div>
      )}
      {data.playlists.length !== 0 && (
        <div className="search-keywords-item">
          <div className="search-keywords-item-title">
            <i className="iconfont icon-gedan" />
            歌单
          </div>
          {data.playlists.map((item) => {
            return (
              <div
                className="search-item"
                key={item.id}
                onClick={() => handlePlaylistClick(item.id)}
              >
                {item.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default React.memo(SearchKeywords);

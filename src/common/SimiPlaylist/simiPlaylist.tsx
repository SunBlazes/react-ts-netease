import React, { useEffect, useState } from "react";
import axios from "../../network";
import SimiPlaylistItem from "./simiPlaylistItem";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const SimiPlaylist: React.FC<SimiPlaylistProps> = (props) => {
  const { id, onClick } = props;
  const [itemArray, setItemArray] = useState<Array<ISimiPlaylistItem>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function parse(playlist: any): ISimiPlaylistItem {
      return {
        id: playlist.id,
        name: playlist.name,
        picUrl: playlist.coverImgUrl,
        playCount: playlist.playCount
      };
    }
    async function fetchData() {
      setLoading(true);
      const { data } = await axios.get(`simi/playlist?id=${id}`);
      const playlists = data.playlists as Array<any>;
      const arr: Array<ISimiPlaylistItem> = [];
      for (let i = 0; i < playlists.length; i++) {
        const item = parse(playlists[i]);
        arr.push(item);
      }
      setItemArray(arr);
      setLoading(false);
    }
    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <div className="simi-playlist">
      {loading ? (
        <div style={{ textAlign: "center" }}>
          <Spin indicator={<LoadingOutlined />} tip={"加载中"} />
        </div>
      ) : (
        itemArray.map((item) => {
          return <SimiPlaylistItem {...item} key={item.id} onClick={onClick} />;
        })
      )}
    </div>
  );
};

export default React.memo(SimiPlaylist);

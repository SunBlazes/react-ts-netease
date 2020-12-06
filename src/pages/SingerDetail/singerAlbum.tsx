import React, { useEffect, useState, useRef } from "react";
import SingerAlbumDetail from "./singerAlbumDetail";
import axios from "../../network";
import classnames from "classnames";

const SingerAlbum: React.FC<SingerAlbumProps> = (props) => {
  const { id, show } = props;
  const [albums, setAlbums] = useState<IAlbumInfo[]>([]);
  const more = useRef(true);
  const [offset, setOffset] = useState(0);
  const classes = classnames("zsw-singer-album", {
    show
  });
  const [firstRequest, setFirstRequest] = useState(false);

  useEffect(() => {
    if (show) {
      setFirstRequest(true);
    }
  }, [show]);

  useEffect(() => {
    more.current = true;
    setAlbums([]);
    setOffset(0);
  }, [id]);

  useEffect(() => {
    let isUnmount = false;
    function handleScroll(e: Event) {
      const target = e.target as HTMLDivElement;
      if (!more.current) {
        el.removeEventListener("scroll", handleScroll);
      }
      if (
        target.scrollTop >= target.scrollHeight - target.offsetHeight &&
        target.scrollTop > 0
      ) {
        !isUnmount && setOffset((offset) => offset + 15);
      }
    }
    const el = document.getElementsByClassName("zsw-singer-detail")[0];
    if (show && el) {
      el.addEventListener("scroll", handleScroll);
    }

    return () => {
      isUnmount = true;
      if (el) {
        el.removeEventListener("scroll", handleScroll);
      }
    };
  }, [show]);

  useEffect(() => {
    let isUnmount = false;
    function parseAlbums(albums: any[]) {
      const arr: IAlbumInfo[] = [];

      for (let i = 0; i < albums.length; i++) {
        const item = albums[i];
        arr.push({
          title: item.name,
          picUrl: item.picUrl,
          id: item.id
        });
      }

      return arr;
    }

    function returnUrl() {
      return `/artist/album?id=${id}&offset=${offset}&limit=${15}`;
    }

    async function fetchData() {
      const { data } = await axios.get(returnUrl());
      if (!isUnmount) {
        more.current = data.more;
        setAlbums((_data) => {
          return _data.concat(parseAlbums(data.hotAlbums));
        });
      }
    }

    if (id && more.current && firstRequest) {
      fetchData();
    }

    return () => {
      isUnmount = true;
    };
  }, [id, offset, firstRequest]);

  return (
    <div className={classes}>
      <SingerAlbumDetail id={id} title="热门50首" top50={true} />
      {albums.map((item) => {
        return (
          <SingerAlbumDetail
            {...item}
            top50={false}
            needExpand={false}
            key={item.id + " " + id}
          />
        );
      })}
    </div>
  );
};

export default React.memo(SingerAlbum);

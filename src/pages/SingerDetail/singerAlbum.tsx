import React, { useEffect, useState } from "react";
import SingerAlbumDetail from "./singerAlbumDetail";
import axios from "../../network";

interface IQueryParams {
  offset: number;
  more: boolean;
  limit: number;
}

const SingerAlbum: React.FC<SingerAlbumProps> = (props) => {
  const { id } = props;
  const [albums, setAlbums] = useState<IAlbumInfo[]>([]);
  const [queryParams, setQueryParams] = useState<IQueryParams>({
    offset: 0,
    more: true,
    limit: 10
  });

  useEffect(() => {
    let isUnmount = false;
    function handleScroll(e: Event) {
      const target = e.target as HTMLDivElement;
      if (!queryParams.more) {
        el.removeEventListener("scroll", handleScroll);
      }
      if (
        target.scrollTop >= target.scrollHeight - target.offsetHeight &&
        target.scrollTop > 0
      ) {
        !isUnmount &&
          setQueryParams((data) => {
            const { limit, more, offset } = data;
            return {
              limit,
              offset: offset + limit,
              more
            };
          });
      }
    }
    const el = document.getElementsByClassName("home-content")[0];
    el.addEventListener("scroll", handleScroll);

    return () => {
      isUnmount = true;
      el.removeEventListener("scroll", handleScroll);
    };
  }, [queryParams.more]);

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
      return `/artist/album?id=${id}&offset=${queryParams.offset}&limit=${queryParams.limit}`;
    }

    async function fetchData() {
      const { data } = await axios.get(returnUrl());
      if (!isUnmount) {
        setQueryParams((_data) => {
          const { offset, limit } = _data;
          return {
            offset,
            limit,
            more: data.more
          };
        });
      }
      setAlbums((_data) => {
        return _data.concat(parseAlbums(data.hotAlbums));
      });
    }

    if (id && queryParams.more) {
      fetchData();
    }

    return () => {
      isUnmount = true;
    };
  }, [id, queryParams.offset, queryParams.more, queryParams.limit]);

  return (
    <div className="zsw-singer-album">
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

import React, { useEffect, useState } from "react";
import {
  FireFilled,
  PlayCircleOutlined,
  FolderAddOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  UpOutlined,
  DownOutlined
} from "@ant-design/icons";
import { parseDate, parsePlayCount } from "../../utils";
import PlaylistInfo from "../../common/PlaylistInfo";
import axios from "../../network";
import { connect } from "react-redux";
import { UnionStateTypes } from "../../store";

interface PlaylistProps {
  playlistShow: boolean;
  id?: string;
}

interface IDetail {
  coverImgUrl: string;
  // 歌单名字
  name: string;
  tags?: Array<string>;
  avatarUrl: string;
  description?: string;
  playCount: number;
  subscribedCount: number;
  shareCount: number;
  createTime: number;
  commentCount: number;
  // 歌单创作者名字
  nickname: string;
  // 歌单歌曲个数
  trackCount: number;
}

const PlayList: React.FC<PlaylistProps> = (props) => {
  const [collapse, setCollapse] = useState(true);
  // 歌单的全部歌曲，订阅者，歌单id
  const [info, setInfo] = useState<PlaylistInfoProps>();
  // 歌单描述信息，创作者信息等等
  const [detail, setDetail] = useState<IDetail>();

  const { playlistShow } = props;

  useEffect(() => {
    function parseSubscriber(subscribers: Array<any>): Array<ISubscriber> {
      const _subscribers = [];
      for (let i = 0; i < subscribers.length; i++) {
        const subscriber: ISubscriber = {
          avatarUrl: subscribers[i].avatarUrl,
          userId: subscribers[i].userId
        };
        _subscribers.push(subscriber);
      }
      return _subscribers;
    }

    function parseInfo(playlist: any): PlaylistInfoProps {
      return {
        trackIds: playlist.trackIds.map((track: any) => track.id),
        subscribers: parseSubscriber(playlist.subscribers),
        playlistId: playlist.id
      };
    }

    function parseDetail(playlist: any): IDetail {
      return {
        coverImgUrl: playlist.coverImgUrl,
        name: playlist.name,
        tags: playlist.tags,
        avatarUrl: playlist.creator.avatarUrl,
        description: playlist.description,
        playCount: playlist.playCount,
        subscribedCount: playlist.subscribedCount,
        shareCount: playlist.shareCount,
        createTime: playlist.createTime,
        commentCount: playlist.commentCount,
        nickname: playlist.creator.nickname,
        trackCount: playlist.trackCount
      };
    }

    async function fetchPlaylistInfo(id: string) {
      const { data } = await axios.get("/playlist/detail?id=" + id);
      console.log(data);
      setDetail(parseDetail(data.playlist));
      console.log(parseDetail(data.playlist));
      setInfo(parseInfo(data.playlist));
    }

    if (props.id) {
      setInfo(undefined);
      fetchPlaylistInfo(props.id);
    }
  }, [props.id]);

  return (
    <>
      <div className={`${playlistShow ? "playlist" : "playlist hidden"}`}>
        <div>
          <div className="playlist-top">
            <div className="cover-image ">
              {detail && <img src={detail.coverImgUrl} alt="" />}
            </div>
            {detail && detail.description && (
              <div className="collapse">
                {collapse ? (
                  <DownOutlined onClick={() => setCollapse(false)} />
                ) : (
                  <UpOutlined onClick={() => setCollapse(true)} />
                )}
              </div>
            )}
            <div className="playlist-detail">
              <div className="playlist-detail-panel-1">
                <div style={{ float: "left" }}>
                  <span className="tag">歌单</span>
                  <span className="content">{detail?.name}</span>
                </div>
              </div>
              <div className="playlist-detail-panel-2">
                <img src={detail?.avatarUrl} alt="" />
                <span className="nickname">{detail?.nickname}</span>
                <span className="createTime">
                  {detail?.createTime &&
                    parseDate("YYYY-mm-dd", detail.createTime)}
                  创建
                </span>
              </div>
              <div className="playlist-detail-panel-3">
                <div className="btn">
                  <PlayCircleOutlined />
                  播放全部
                </div>
                <div className="btn">
                  <FolderAddOutlined />
                  收藏{`(${detail ? detail.subscribedCount : 0})`}
                </div>
                <div className="btn">
                  <ShareAltOutlined />
                  分享{`(${detail ? detail.shareCount : 0})`}
                </div>
                <div className="btn">
                  <DownloadOutlined />
                  下载全部
                </div>
              </div>
              {detail && detail.tags && (
                <div className="playlist-detail-panel-4">
                  标签:
                  {detail.tags.map((tag) => {
                    return <span key={tag}>{tag}</span>;
                  })}
                </div>
              )}
              {detail && detail.description && (
                <div
                  className={`playlist-detail-panel-5 ${
                    collapse ? "collapsed" : ""
                  }`}
                >
                  简介:
                  {detail.description.trim()}
                </div>
              )}
            </div>
            <div className="right">
              <FireFilled style={{ marginRight: 10 }} />
              {detail?.trackCount}
              <PlayCircleOutlined style={{ margin: "0 10px" }} />
              {detail?.playCount && parsePlayCount(detail.playCount)}
            </div>
          </div>
          <div className="playlist-bottom">
            {info && <PlaylistInfo {...info} />}
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: UnionStateTypes) => {
  const home = state.home;
  return {
    playlistShow: home.showMap.get("playlist") as boolean
  };
};

export default connect(mapStateToProps)(React.memo(PlayList));

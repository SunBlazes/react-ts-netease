import React, { useEffect, useState } from "react";
import { LeftOutlined, LoadingOutlined } from "@ant-design/icons";
import CommentItem, { CommentItemProps } from "./commentItem";
import axios from "../../network";
import { parseComments } from "./comments";
import { connect } from "react-redux";
import { UnionStateTypes } from "../../store";
import { getToggleTypeShowAction, direction } from "../../pages/Home/store";

interface IQueryParams {
  page: number;
  limit: number;
}

interface MoreCommentsProps {
  type: commentType;
  id: string;
  toggleShow: (direction: direction) => void;
}

const MoreComments: React.FC<MoreCommentsProps> = (props) => {
  const { id, type, toggleShow } = props;
  const [comments, setComments] = useState<Array<CommentItemProps>>([]);
  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 0,
    limit: 20
  });
  const [hasMore, setHasMore] = useState(true);
  const [isReachBottom, setReachBottom] = useState(false);

  useEffect(() => {
    const $homeContent = document.getElementsByClassName(
      "home-content"
    )[0] as HTMLDivElement;
    function handleScroll2Bottom(e: Event) {
      const target = e.target as HTMLDivElement;
      if (target.scrollTop + target.offsetHeight + 20 > target.scrollHeight) {
        setReachBottom(true);
      } else {
        setReachBottom(false);
      }
    }
    if ($homeContent) {
      $homeContent.addEventListener("scroll", handleScroll2Bottom);
    }
    return () => {
      $homeContent.removeEventListener("scroll", handleScroll2Bottom);
    };
  }, []);

  useEffect(() => {
    function fetchUrl() {
      const { page, limit } = queryParams;
      const offset = page * limit;
      switch (type) {
        case "playlist":
          return `comment/hot?id=${id}&type=2&offset=${offset}&limit=${limit}`;
        case "music":
          return `comment/hot?id=${id}&type=0&offset=${offset}&limit=${limit}`;
        case "mv":
          return `comment/hot?id=${id}&type=1&offset=${offset}&limit=${limit}`;
        case "album":
          return `comment/hot?id=${id}&type=3&offset=${offset}&limit=${limit}`;
      }
    }

    async function fetchComments() {
      const { data } = await axios.get(fetchUrl());
      setHasMore(data.hasMore);
      setComments((_data) => {
        return _data.concat(parseComments(data.hotComments));
      });
    }

    fetchComments();
  }, [queryParams, id, type]);

  useEffect(() => {
    if (isReachBottom) {
      setQueryParams((data) => {
        return {
          page: data.page + 1,
          limit: data.limit
        };
      });
    }
  }, [isReachBottom]);

  function onBack() {
    toggleShow("prev");
  }

  return (
    <div className="zsw-more-comments">
      <div className="more-comments-nav">
        <LeftOutlined onClick={onBack} />
        精彩评论
      </div>
      <div className="zsw-more-comments-content">
        {comments.map((comment) => {
          return <CommentItem {...comment} key={comment.commentId} />;
        })}
        {hasMore && (
          <div className="loading">
            <LoadingOutlined />
            <span className="text">加载中...</span>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (
  state: UnionStateTypes
): { type: commentType; id: string } => {
  const comments = state.comments;
  return {
    type: comments.type,
    id: comments.id
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    toggleShow(direction: direction) {
      dispatch(getToggleTypeShowAction(direction));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(MoreComments));

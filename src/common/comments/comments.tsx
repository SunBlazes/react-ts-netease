import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import CommentItem, { CommentItemProps, IBeReplied } from "./commentItem";
import axios from "../../network";
import { LoadingOutlined, RightOutlined } from "@ant-design/icons";
import { Pagination } from "antd";
import { PaginationProps } from "antd/es/pagination";
import { connect } from "react-redux";
import { getSetMoreCommentsAttrAction } from "./store";
import { getChangeTypeShowAction } from "../../pages/Home/store";

export interface IQueryParams {
  page: number;
  limit: number;
}

export function parseReplied(beReplied: Array<any>): Array<IBeReplied> | [] {
  if (beReplied.length === 0) return [];

  const _beReplied = [];

  for (let i = 0; i < beReplied.length; i++) {
    const element = beReplied[i];
    const replied: IBeReplied = {
      content: element.content,
      userId: element.user.userId,
      nickname: element.user.nickname,
      beRepliedCommentId: element.beRepliedCommentId
    };
    _beReplied.push(replied);
  }

  return _beReplied;
}

export function parseComments(
  comments: Array<any>
): Array<CommentItemProps> | [] {
  if (comments.length === 0) return [];
  const _comments = [];
  for (let i = 0; i < comments.length; i++) {
    const element = comments[i];
    const comment: CommentItemProps = {
      userId: element.user.userId,
      nickname: element.user.nickname,
      avatarUrl: element.user.avatarUrl,
      content: element.content,
      time: element.time,
      likedCount: element.likedCount,
      commentId: element.commentId,
      beReplied: parseReplied(element.beReplied)
    };
    _comments.push(comment);
  }
  console.log(_comments);
  return _comments;
}

const Commets: React.FC<CommentsProps> = (props) => {
  const [restCount, setRestCount] = useState(280);
  const [popComments, setPopComments] = useState<Array<CommentItemProps>>([]);
  const [newComments, setNewComments] = useState<Array<CommentItemProps>>([]);
  const [loading, setLoading] = useState(false);
  // 有无更多的热门评论
  const [moreHot, setMoreHot] = useState(false);
  const [popCommentsShow, setPopCommentsShow] = useState(false);
  const { id, type, setMoreCommentsAttr, changeShow } = props;
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
  const $homeContent = useRef<HTMLDivElement>();

  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 0,
    limit: 50
  });

  function handlePageSizeChange(page: number) {
    if (page >= 2) {
      setPopCommentsShow(false);
    } else if (page === 1) {
      setPopCommentsShow(true);
    }
    scrollY(200);
    setQueryParams((data) => {
      return {
        page: page - 1,
        limit: data.limit
      };
    });
  }

  function handleMoreClick() {
    setMoreCommentsAttr({
      id,
      type
    });
    changeShow("moreComments");
  }

  useEffect(() => {
    $homeContent.current = document.getElementsByClassName(
      "home-content"
    )[0] as HTMLDivElement;
  }, []);

  function scrollY(top: number) {
    if ($homeContent && $homeContent.current) {
      $homeContent.current.scroll({ top });
    }
  }

  useEffect(() => {
    function fetchUrl(id: string, type: commentType) {
      const { page, limit } = queryParams;
      const offset = page * limit;
      switch (type) {
        case "playlist":
          return `comment/playlist?id=${id}&limit=${limit}&offset=${offset}`;
        case "music":
          return `comment/music?id=${id}&limit=${limit}&offset=${offset}`;
        case "mv":
          return `comment/mv?id=${id}&limit=${limit}&offset=${offset}`;
      }
    }

    async function fetchComments() {
      setLoading(true);
      const { data } = await axios.get(fetchUrl(id, type));
      console.log(data);
      if (queryParams.page === 0) {
        setMoreHot(data.moreHot);
        setPopComments(parseComments(data.hotComments));
        setPopCommentsShow(true);
      }
      setNewComments(parseComments(data.comments));
      setPagination({
        total: data.total
      });
      setLoading(false);
    }

    fetchComments();
  }, [id, type, queryParams]);

  function onChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setRestCount(280 - e.target.value.length);
  }

  return (
    <div className="zsw-comments">
      <div className="textarea">
        <div className="textarea-inner">
          <textarea
            name=""
            id=""
            rows={3}
            maxLength={280}
            onChange={onChange}
          />
          <div className="rest-words-count">{restCount}</div>
        </div>
        <button className="btn-comment">评论</button>
      </div>
      {popComments.length !== 0 && (
        <div className={`pop-comments ${popCommentsShow ? "show" : ""}`}>
          <div className="zsw-comments-title">精彩评论</div>
          {popComments.map((comment) => {
            return <CommentItem {...comment} key={comment.commentId} />;
          })}
          {moreHot && (
            <div className="more">
              <span onClick={handleMoreClick}>
                查看更多评论
                <RightOutlined />
              </span>
            </div>
          )}
        </div>
      )}
      <div className="new-comments">
        <div className="zsw-comments-title">最新评论({pagination.total})</div>
        {loading && (
          <div className="loading">
            <LoadingOutlined />
            <span className="text">加载中...</span>
          </div>
        )}
        {newComments.map((comment) => {
          return <CommentItem {...comment} key={comment.commentId} />;
        })}
        <div className="comments-pagination">
          <Pagination {...defaultPagination.current} {...pagination} />
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setMoreCommentsAttr(attr: MoreCommentsAttrType) {
      dispatch(getSetMoreCommentsAttrAction(attr));
    },
    changeShow(type: showOfType) {
      dispatch(getChangeTypeShowAction(type));
    }
  };
};

export default connect(null, mapDispatchToProps)(React.memo(Commets));

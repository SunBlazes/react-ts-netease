import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import CommentItem, { CommentItemProps, IBeReplied } from "./commentItem";
import axios from "../../network";
import { LoadingOutlined, RightOutlined } from "@ant-design/icons";
import { Pagination, message } from "antd";
import { PaginationProps } from "antd/es/pagination";
import { connect } from "react-redux";
import { getSetMoreCommentsAttrAction } from "./store";
import { getChangeTypeShowAction } from "../../pages/Home/store";
import { UnionStateTypes } from "../../store";
import { getChangeSignInShowAction } from "../SignIn/store/actionCreator";

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

const Comments: React.FC<CommentsProps> = (props) => {
  const [restCount, setRestCount] = useState(280);
  const [popComments, setPopComments] = useState<Array<CommentItemProps>>([]);
  const [newComments, setNewComments] = useState<Array<CommentItemProps>>([]);
  const [loading, setLoading] = useState(false);
  // 有无更多的热门评论
  const [moreHot, setMoreHot] = useState(false);
  const [popCommentsShow, setPopCommentsShow] = useState(false);
  const {
    id,
    type,
    setMoreCommentsAttr,
    changeShow,
    userState,
    ChangeSignInShow
  } = props;
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1
  });
  const $textarea = useRef<HTMLTextAreaElement>(null);
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
    let isUnmount = false;
    function fetchUrl(id: string, type: commentType) {
      const { page, limit } = queryParams;
      const offset = page * limit;
      switch (type) {
        case "playlist":
          return `comment/playlist?id=${id}&limit=${limit}&offset=${offset}&timestamp=${Date.now()}`;
        case "music":
          return `comment/music?id=${id}&limit=${limit}&offset=${offset}&timestamp=${Date.now()}`;
        case "mv":
          return `comment/mv?id=${id}&limit=${limit}&offset=${offset}&timestamp=${Date.now()}`;
        case "album":
          return `comment/album?id=${id}&limit=${limit}&offset=${offset}&timestamp=${Date.now()}`;
      }
    }

    async function fetchComments() {
      !isUnmount && setLoading(true);
      const { data } = await axios.get(fetchUrl(id, type));
      console.log(data);
      if (queryParams.page === 0) {
        !isUnmount && setMoreHot(data.moreHot);
        !isUnmount && setPopComments(parseComments(data.hotComments));
        !isUnmount && setPopCommentsShow(true);
      }
      !isUnmount && setNewComments(parseComments(data.comments));
      !isUnmount &&
        setPagination({
          total: data.total
        });
      !isUnmount && setLoading(false);
    }

    fetchComments();

    return () => {
      isUnmount = true;
    };
  }, [id, type, queryParams]);

  function onChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setRestCount(280 - e.target.value.length);
  }

  function mapTypeToNum(type: commentType) {
    switch (type) {
      case "music":
        return 0;
      case "mv":
        return 1;
      case "playlist":
        return 2;
    }
  }

  function sendComment() {
    if (!userState) {
      return ChangeSignInShow();
    }
    if ($textarea && $textarea.current) {
      const _type = mapTypeToNum(type);
      axios
        .get(
          `/comment?t=1&type=${_type}&id=${id}&content=${$textarea.current.value}`,
          { withCredentials: true }
        )
        .then((res) => {
          const comment = res.data.comment;
          const commentItem: CommentItemProps = {
            commentId: comment.commentId,
            content: comment.content,
            time: comment.time,
            userId: comment.user.userId,
            nickname: comment.user.nickname,
            avatarUrl: comment.user.avatarUrl,
            likedCount: 0
          };
          message.success({
            content: "评论发送成功",
            duration: 0.5,
            onClose: () => {
              setNewComments((value) => {
                return [commentItem].concat(value);
              });
              if ($textarea && $textarea.current) {
                $textarea.current.value = "";
              }
            }
          });
        })
        .catch((error) => console.log(error));
    }
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
            ref={$textarea}
          />
          <div className="rest-words-count">{restCount}</div>
        </div>
        <button className="btn-comment" onClick={sendComment}>
          评论
        </button>
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

const mapStateToProps = (state: UnionStateTypes) => {
  const header = state.header;
  return {
    userState: header.userState
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setMoreCommentsAttr(attr: MoreCommentsAttrType) {
      dispatch(getSetMoreCommentsAttrAction(attr));
    },
    changeShow(type: showOfType) {
      dispatch(getChangeTypeShowAction(type));
    },
    ChangeSignInShow() {
      dispatch(getChangeSignInShowAction(true));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Comments));

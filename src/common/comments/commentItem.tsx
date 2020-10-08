import React from "react";
import { parseDate } from "../../utils";
import { LikeOutlined } from "@ant-design/icons";

export interface IBeReplied {
  nickname: string;
  userId: string;
  content: string;
  beRepliedCommentId: string;
}

export interface CommentItemProps {
  userId: string;
  nickname: string;
  avatarUrl: string;
  content: string;
  time: string;
  commentId: string;
  beReplied?: Array<IBeReplied>;
  likedCount: number;
}

const CommentItem: React.FC<CommentItemProps> = (props) => {
  const { nickname, avatarUrl, content, time, beReplied, likedCount } = props;

  return (
    <div className="comment-item">
      <div className="img">
        <img src={avatarUrl} alt="" className="avatar" width={36} />
      </div>
      <div className="info">
        <p className="content">
          <span className="avatar-name">{nickname}:</span> {content}
        </p>
        {beReplied &&
          beReplied.length !== 0 &&
          beReplied.map((reply) => {
            return (
              <div className="reply" key={reply.beRepliedCommentId}>
                <span className="avatar-name">{reply.nickname}</span>
                {reply.content}
              </div>
            );
          })}
        <p className="time">{parseDate("YYYY年m月d日 HH:MM", time)}</p>
      </div>
      <div className="interaction">
        <span>
          <LikeOutlined />({likedCount})
        </span>
        <span className="split">|</span>
        <span>分享</span>
        <span className="split">|</span>
        <span>回复</span>
      </div>
    </div>
  );
};

export default React.memo(CommentItem);

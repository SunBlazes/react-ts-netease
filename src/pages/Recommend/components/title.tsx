import React from "react";

interface TitleProps {
  title: string;
  moreClick: () => void;
}

const Title: React.FC<TitleProps> = (props) => {
  const { title, moreClick } = props;

  return (
    <div className="recommend-panel-title">
      <span className="fl">{title}</span>
      <span className="fr" onClick={moreClick}>
        更多
      </span>
    </div>
  );
};

export default React.memo(Title);

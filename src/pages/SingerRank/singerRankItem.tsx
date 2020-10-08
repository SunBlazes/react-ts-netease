import React from "react";
import Lazyload from "../../common/Lazyload";

const SingerRankItem: React.FC<SingerRankItemProps> = (props) => {
  const { picUrl, name, lastRank, index, score, totalScore, onClick } = props;

  return (
    <div className="total-singer-rank-item" onClick={onClick}>
      <div className="total-singer-rank-item-index">
        <div
          className={`total-singer-rank-item-index-curr ${
            index < 3 ? "three" : ""
          }`}
        >
          {index + 1}
        </div>
        {lastRank === undefined ? (
          <div className="total-singer-rank-item-index-dis new">new</div>
        ) : index - lastRank === 0 ? (
          <div className="total-singer-rank-item-index-dis">-0</div>
        ) : index - lastRank > 0 ? (
          <div className="total-singer-rank-item-index-dis positive">
            <span className="iconfont icon-down-jiantou-right"></span>
            {index - lastRank}
          </div>
        ) : (
          <div className="total-singer-rank-item-index-dis negative">
            <span className="iconfont icon-down-jiantou-right"></span>
            {index - lastRank}
          </div>
        )}
      </div>
      <div className="total-singer-rank-item-img">
        <Lazyload src={picUrl + "?param=44y44"} />
      </div>
      <div className="total-singer-rank-item-name">{name}</div>
      <div className="total-singer-rank-item-score">
        <div
          className="total-singer-rank-item-score-inner"
          style={{ width: (score / totalScore) * 100 + "%" }}
        ></div>
      </div>
    </div>
  );
};

export default React.memo(SingerRankItem);

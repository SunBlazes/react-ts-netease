import React, { useContext } from "react";
import { passedContext } from "./swipe";

type position = "left" | "center" | "right" | "active";

export interface SwipeItemProps {
  index?: number;
  style?: React.CSSProperties;
  pos?: position;
}

const SwipeItem: React.FC<SwipeItemProps> = React.memo(
  ({ index, children, style }) => {
    const context = useContext(passedContext);
    const { currIndex, count } = context;
    const resInitPos = (): position => {
      if (currIndex === undefined || count === undefined) return "center";
      if (currIndex + 1 === index) {
        return "right";
      } else if (
        currIndex - 1 === index ||
        (!currIndex && index === count - 1)
      ) {
        return "left";
      } else if (currIndex === index) {
        return "active";
      }
      return "center";
    };
    const posClass = resInitPos();

    return (
      <div style={style} className={`swipe-item ${posClass}`}>
        {children}
      </div>
    );
  }
);

SwipeItem.displayName = "SwipeItem";

export default SwipeItem;

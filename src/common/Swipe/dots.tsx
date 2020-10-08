import React, { ReactElement, useContext } from "react";
import { passedContext } from "./swipe";

interface DotsProps {}

const Dots: React.FC<DotsProps> = React.memo(() => {
  const context = useContext(passedContext);
  const { currIndex, count } = context;

  function hover(index: number) {
    context.hover && context.hover(index);
  }

  function leave() {
    context.leave && context.leave();
  }

  const renderChildren = () => {
    if (!count) return;
    const arr = [] as ReactElement[];
    for (let i = 0; i < count; i++) {
      let isActive = false;
      if (currIndex === i + 1) {
        isActive = true;
      } else if (currIndex === 0 && i === count - 1) {
        isActive = true;
      } else if (currIndex === count + 1 && i === 0) {
        isActive = true;
      }

      arr.push(
        <li
          key={i}
          className={`dot ${isActive ? "active" : ""}`}
          onMouseEnter={() => hover(i + 1)}
          onMouseLeave={leave}
        ></li>
      );
    }
    return arr;
  };

  return <ul className="dots clearfix">{renderChildren()}</ul>;
});

Dots.displayName = "Dots";

export default Dots;

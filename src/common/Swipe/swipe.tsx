import React, { useRef, useState, createContext, useEffect } from "react";
import { SwipeItemProps } from "./swipeItem";
import Dots from "./dots";

export interface SwipeProps {
  style?: React.CSSProperties;
  duration?: number;
}

interface SwipeContext {
  currIndex?: number;
  count?: number;
  hover?: (index: number) => void;
  leave?: () => void;
}

type fcEl = React.FunctionComponentElement<SwipeItemProps>;

export const passedContext = createContext<SwipeContext>({});

const Swipe: React.FC<SwipeProps> = ({ style, children, duration }) => {
  const count = useRef(0);
  const timer = useRef<any>();
  const [playState, changePlayState] = useState(true);
  const [currIndex, changeIndex] = useState(1);

  const passedContextValue: SwipeContext = {
    currIndex,
    count: count.current,
    hover: handleHover,
    leave: handleLeave
  };

  const RenderChildren = () => {
    const length = React.Children.count(children);
    const res = React.Children.map(children, (child, index) => {
      const _child = child as fcEl;
      if (_child.type.displayName === "SwipeItem") {
        return React.cloneElement(_child, {
          index: index + 1
        });
      } else {
        console.error("Warning: Swipe's children must be SwipeItem");
      }
    }) as fcEl[];
    if (res.length !== 0 && res[0] && res[length - 1]) {
      res.unshift(
        React.cloneElement(res[length - 1], {
          key: "copy_last",
          index: 0
        })
      );
      res.push(
        React.cloneElement(res[1], {
          key: "copy_first",
          index: length + 1
        })
      );
    }
    passedContextValue.count = length;
    count.current = length;
    return res;
  };

  function handleHover(index: number) {
    changePlayState(false);
    clearTimeout(timer.current);
    changeIndex(index);
  }

  function handleLeave() {
    changePlayState(true);
  }

  useEffect(() => {
    function next() {
      if (!count || count.current === undefined) return;
      if (currIndex === count.current) {
        return changeIndex(0);
      }
      timer.current = setTimeout(() => {
        changeIndex(currIndex + 1);
      }, duration);
    }
    if (playState) next();
  }, [currIndex, duration, playState]);

  return (
    <div className="zsw-swipe" style={style}>
      <passedContext.Provider value={passedContextValue}>
        <div>{RenderChildren()}</div>
        <Dots />
      </passedContext.Provider>
    </div>
  );
};

Swipe.defaultProps = {
  duration: 5000
};

export default Swipe;

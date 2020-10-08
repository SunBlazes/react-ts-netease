import React from "react";
import { CSSTransition } from "react-transition-group";
import { CSSTransitionProps } from "_@types_react-transition-group@4.4.0@@types/react-transition-group/CSSTransition";

const useTransition = (
  attrs: CSSTransitionProps,
  Component: React.ReactElement
) => {
  return <CSSTransition {...attrs}>{Component}</CSSTransition>;
};

export default useTransition;

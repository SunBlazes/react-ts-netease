import * as types from "./actionType";

export const getChangeTypeShowAction = (
  showType: showOfType
): types.HomeActionTypes => {
  return {
    type: "change_show",
    showType
  };
};

export const getToggleTypeShowAction = (
  direction: types.direction,
  callback?: Function
): types.HomeActionTypes => {
  return {
    type: types.TOGGLE_TYPE_SHOW,
    direction,
    callback
  };
};

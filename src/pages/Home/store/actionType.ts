export const CHNAGE_TYPE_SHOW = "change_show";
type CHANGE_TYPE_SHOW_TYPE = typeof CHNAGE_TYPE_SHOW;

export const TOGGLE_TYPE_SHOW = "toggle_type_show";
type TOGGLE_TYPE_SHOW_TYPE = typeof TOGGLE_TYPE_SHOW;

export type direction = "prev" | "next";

interface ChangeTypeShowType {
  type: CHANGE_TYPE_SHOW_TYPE;
  showType: showOfType;
}

// 导航栏前进和后退的action
interface ToggleTypeShowType {
  type: TOGGLE_TYPE_SHOW_TYPE;
  direction: direction;
  callback?: Function;
}

export type HomeActionTypes = ChangeTypeShowType | ToggleTypeShowType;

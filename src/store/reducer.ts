import { combineReducers } from "redux";
import HeadeReducer from "../common/Header/store";
import SignInReducer from "../common/SignIn/store";
import PlayerReducer from "../common/Player/store";
import CommentsReducer from "../common/comments/store";
import HomeReducer from "../pages/Home/store";

export default combineReducers({
  header: HeadeReducer,
  signIn: SignInReducer,
  player: PlayerReducer,
  comments: CommentsReducer,
  home: HomeReducer
});

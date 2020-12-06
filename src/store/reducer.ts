import { combineReducers } from "redux";
import HeadeReducer from "../common/Header/store";
import SignInReducer from "../common/SignIn/store";
import PlayerReducer from "../common/Player/store";

export default combineReducers({
  header: HeadeReducer,
  signIn: SignInReducer,
  player: PlayerReducer
});

import {combineReducers} from 'redux';
import modal from './modal';
import conversation from './conversation';
import user from './user';
import focus from './modal';
const rootReducer = combineReducers({
  modal: modal,
  convo: conversation,
  user: user,
  focus: focus,
});

export default rootReducer;

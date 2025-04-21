import {combineReducers} from 'redux';
import modal from './modal';
import conversation from './conversation';
import user from './user';
import focus from './modal';
import theme from './theme';
const rootReducer = combineReducers({
  modal: modal,
  convo: conversation,
  user: user,
  theme: theme,
  focus: focus,
});

export default rootReducer;

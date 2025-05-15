import {combineReducers} from 'redux';
import model from './model';
import conversation from './conversation';

import user from './user';
import theme from './theme';
const rootReducer = combineReducers({
  model: model,
  convo: conversation,
  user: user,
  theme: theme,
});

export default rootReducer;

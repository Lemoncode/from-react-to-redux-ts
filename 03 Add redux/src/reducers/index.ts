import { combineReducers } from 'redux';
import { memberListReducer, MemberListState } from './memberListReducer';

export interface State {
  memberListReducer : MemberListState;
}

export const reducers = combineReducers<State>({
  memberListReducer,
});
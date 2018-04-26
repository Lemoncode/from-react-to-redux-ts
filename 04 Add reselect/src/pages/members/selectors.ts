import { createSelector } from 'reselect';
import { getMemberList } from '../../reducers/selectors';
import { mapMemberListFromModelToVm } from './mapper';

export const getMemberListVM = createSelector(
  getMemberList, 
  (memberList) => mapMemberListFromModelToVm(memberList), 
);

import { MemberEntity } from '../api/model';
import { actionsDefs } from '../const';
import { fetchMemberList } from '../api';

export const fetchMemberListRequestStart = () => (dispatcher) => {
  const promise = fetchMemberList();

  promise.then((memberList) => {
    dispatcher(fetchMemberListCompleted(memberList));
  });
}

const fetchMemberListCompleted = (memberList: MemberEntity[]) => ({
  type: actionsDefs.FETCH_MEMBERS_COMPLETED,
  payload: memberList,
});

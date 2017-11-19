import { MemberEntity } from '../api/model';
import { actionsDefs } from '../const';

export interface MemberListState {
  memberList : MemberEntity[];
}

interface BaseAction {
  type : string;
  payload : any;
}

const createDefaultState = () => ({
  memberList: [],
});

export const memberListReducer = (state : MemberListState = createDefaultState(), action : BaseAction) : MemberListState => {
  switch (action.type) {
    case actionsDefs.FETCH_MEMBERS_COMPLETED:
      // Return the new state
      return handleFetchMembersCompleted(state, action.payload);
  }

  return state;
}

// We use destructuring to create the new state. We create a new object and replace memberList by the one received as a parameter (action.payload)
const handleFetchMembersCompleted = (state : MemberListState, memberList : MemberEntity[]) : MemberListState => ({
  ...state,
  memberList,
});
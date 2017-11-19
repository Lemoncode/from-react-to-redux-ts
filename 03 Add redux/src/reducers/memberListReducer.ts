import { MemberEntity } from '../api/model';
import { actionsDefs } from '../const';

// We create an object showing how spread operator (...) works because it helps keeping the object inmutable,
// but we could have set the state directly to an array of members.
export interface MemberListState {
  memberList : MemberEntity[];
}

// The interface BaseAction could be promoted to a common file and be reused in other reducers
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

const handleFetchMembersCompleted = (state : MemberListState, memberList : MemberEntity[]) : MemberListState => ({
  // We could have simply returned the list of members, but we are returning an object with the list of members 
  // using spread operator to show how it helps keeping objects inmutable
  ...state,
  memberList,
});
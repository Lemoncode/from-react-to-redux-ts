import * as React from 'react';
import { connect } from 'react-redux';
import { State } from '../../reducers';
import { MemberListPage } from './page';
import { MemberEntity } from './viewModel';
import { mapMemberListFromModelToVm } from './mapper';
import { fetchMemberListRequestStart } from '../../actions';

const mapStateToProps = (state: State) => ({
  // This mapping is necessary because we have two different ModelEntity interfaces with the same name.
  // This could be improved using selectors.
  memberList: mapMemberListFromModelToVm(state.memberListReducer.memberList),
});

const mapDispatchToProps = (dispatch) => ({
  fetchMemberList: () => { dispatch(fetchMemberListRequestStart()) }
});

export const MemberListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MemberListPage);


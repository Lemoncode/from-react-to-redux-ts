import * as React from 'react';
import { connect } from 'react-redux';
import { State } from '../../reducers';
import { MemberListPage } from './page';
import { fetchMemberListRequestStart } from '../../actions';
import { getMemberListVM } from './selectors';

const mapStateToProps = (state: State) => ({
  memberList: getMemberListVM(state), 
});

const mapDispatchToProps = (dispatch) => ({
  fetchMemberList: () => { dispatch(fetchMemberListRequestStart()) }
});

export const MemberListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MemberListPage);
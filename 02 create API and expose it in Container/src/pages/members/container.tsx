import * as React from 'react';
import { MemberListPage } from './page';
import { MemberEntity } from './viewModel';
import { fetchMemberList } from '../../api';
import { mapMemberListFromModelToVm } from './mapper';

interface State {
  memberList : MemberEntity[];
}

export class MemberListContainer extends React.Component<{}, State> {

  constructor(props) {
    super(props);
    this.state = { memberList: [] };
  }

  fetchMembers = () => {
    fetchMemberList().then((memberList) => {
      this.setState({
        memberList: mapMemberListFromModelToVm(memberList),
      });
    });
  }

  render() {
    return (
      <MemberListPage
        memberList={this.state.memberList}
        fetchMemberList={this.fetchMembers}
      />
    );
  }
}
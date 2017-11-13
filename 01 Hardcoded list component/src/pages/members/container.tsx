import * as React from 'react';
import { MemberListPage } from './page';
import { MemberEntity } from './viewModel';

interface State {
  memberList : MemberEntity[];
}

export class MemberListContainer extends React.Component<{}, State> {

  constructor(props) {
    super(props);
    this.state = { memberList: [] };
  }

  fetchMembers = () => {
    setTimeout(() => {
      this.setState({
        memberList: [
          {
            id: 1,
            name: 'John',
            avatarUrl: 'https://avatars1.githubusercontent.com/u/1457912?v=4',
          },
          {
            id: 2,
            name: 'Martin',
            avatarUrl: 'https://avatars2.githubusercontent.com/u/4374977?v=4',
          },
        ]
      });
    }, 500);
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
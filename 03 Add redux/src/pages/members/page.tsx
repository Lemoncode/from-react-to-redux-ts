import * as React from 'react';
import { MemberEntity } from './viewModel';
import { MemberTable } from './components';

interface Props {
  memberList: MemberEntity[];
  fetchMemberList: () => void;
}

export class MemberListPage extends React.Component<Props, {}> {

  componentDidMount() {
    this.props.fetchMemberList();
  }

  render() {
    return (
      <MemberTable
        memberList={this.props.memberList}
      />
    );
  }
}

import * as React from 'react';
import { MemberEntity } from '../viewModel';
import { MemberRow } from './memberRow';

interface Props {
  memberList : MemberEntity[];
}

export const MemberTable = (props : Props) => (
  <table className="table">
    <thead>
      <tr>
        <th>Picture</th>
        <th>Id</th>
        <th>Name</th>
      </tr>
    </thead>
    <tbody>
      {
        props.memberList.map(
          (member) => <MemberRow
            key={member.id}
            member={member}
          />
        )
      }
    </tbody>
  </table>
);

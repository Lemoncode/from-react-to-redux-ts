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
        <th>Foto</th>
        <th>Id</th>
        <th>Nombre</th>
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
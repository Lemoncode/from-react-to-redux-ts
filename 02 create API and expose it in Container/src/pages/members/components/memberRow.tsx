import * as React from 'react';
import { MemberEntity } from '../viewModel';

interface Props {
  member : MemberEntity;
}

export const MemberRow = (props : Props) => (
  <tr>
    <td><img src={props.member.avatarUrl} style={{ width: '200px' }} /></td>
    <td>{props.member.id}</td>
    <td>{props.member.name}</td>
  </tr>
);
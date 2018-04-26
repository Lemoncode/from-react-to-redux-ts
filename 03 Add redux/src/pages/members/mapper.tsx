import * as apiModel from '../../api/model';
import * as vm from './viewModel';

const mapMemberFromModelToVm = (member: apiModel.MemberEntity) : vm.MemberEntity => (
    {
        id: member.id,
        avatarUrl: member.avatar_url,
        name: member.login,
    }
)

export const mapMemberListFromModelToVm = (memberList: apiModel.MemberEntity[]) : vm.MemberEntity[]  => (
    memberList.map(mapMemberFromModelToVm)
)

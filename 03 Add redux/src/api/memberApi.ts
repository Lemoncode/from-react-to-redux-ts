import { MemberEntity } from './model';

const baseRoot = 'https://api.github.com/orgs/lemoncode';
const membersURL = `${baseRoot}/members`

export const fetchMemberList = () : Promise<MemberEntity[]> => {

  return fetch(membersURL)
            .then(checkStatus)
            .then(parseJSON)
            .then(resolveMembers)


}

const checkStatus = (response : Response) : Response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    let error = new Error(response.statusText);
    throw error;
  }
}

const parseJSON = (response : Response) : any => {
  return response.json();
}

const resolveMembers = (data : any) : MemberEntity[] => {
  const members = data.map(
    ({id, login, avatar_url,}) => ({ id, login, avatar_url, } as MemberEntity)
  );

  return members;
}




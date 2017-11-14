import { MemberEntity } from './model';

const baseRoot = 'https://api.github.com/orgs/lemoncode';
const membersURL = `${baseRoot}/members`

export const fetchMemberList = () : Promise<MemberEntity[]> => {

  return fetch(membersURL)
            .then(checkStatus)
            .then(parseJSON)
            .then(resolveMembers)


}

// If we return a value that is not a "thennable", it is automatically
// promoted to a promise, so we can keep chaining "then" class without
// wrapping the returned values with Promise.resolve(...)
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

// This simplified syntax represents the following steps:
// 1- First, we call our function for each entry in the "data" array
// 2- For each of this objects, we then create 3 input varialbes (id, login, avatar_url)
// using destructuring in the signature for the arrow function's arguments
// 3- We create a new object with these 3 variables using the short syntax
// for objects parameters (i.e. {id, login, avatar_url} equals {id:id, login: login,
// avatar_url: avatar_url})
// 4- Finally, we perform a "cast" of this object to MemberEntity TS interface 
// (since our properties have the same names and types as the ones in the interface, 
// we sort of "implement" it)
const resolveMembers = (data : any) : MemberEntity[] => {
  const members = data.map(
    ({id, login, avatar_url,}) => ({ id, login, avatar_url, } as MemberEntity)
  );

  return members;
}

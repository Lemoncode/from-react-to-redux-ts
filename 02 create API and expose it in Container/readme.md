# 02 Create API and expose it in Container

In this sample we are going to add an Api to our application and integrate it into our Container component, replacing the previously added hardcoded data.

We will use as start up point _01 Hardcoded list component.

Summary steps:

- Create a data model for the API.
- Implement an API call that fetches data from the web and parses it into the previously defined data model.
- Create an auxiliary mapper module to parse from the api data model to the view model used in the Container component tree.
- Modify the container component to use the API calls and the subsequently returned data.

# Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) if they are not already installed on your computer.

> Verify that you are running at least node v6.x.x and npm 5.x.x by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps to build it

- Copy the content of the `01 Hardcoded list component` folder to an empty folder for the sample.

- Install the npm packages described in the `package.json` and verify that it works:

```
npm install
```

- 

- We will start by creating a suitable folder structure for our new API. 
```
.
└── api/
    └── model/
		  	├── index.ts
		    ├── member.ts
		├── memberApi.ts
	  └── index.ts
```

- First, we add an `api subfolder` inside `src`. Then, inside `src/api` we create a new subfolder named `src/api/model`

- Let's start by defining the data model used in our API. Our data source will be a list of GitHub members. As we know from the previous case, we want to be able to display the id, name and profile image (represented as an Url) inside our members page. Thus, the data that we really care to retrieve should hold 1 number property for the id, and 2 string properties for the user login name and avatar image Url respectively . Consequently, we will create a `member.ts` file inside `src/api/model` with the content below:

```javascript
export interface MemberEntity {
    login: string;
    id: number;
    avatar_url: string;
}
```

- And since we want to be able to access this interface later from both the API call itself (to properly format the data fetched) and from our auxiliary mapper modulee (to ensure that we can parse from this interface to the one used internally in our view model), we will also define a barrel `index.ts` file for our `src/api/model` folder, as follows:

´´´javascript
export {MemberEntity} from './member';
´´´

- Next we can start working on our `memberApi.ts` file. We will import our data model from `./model` barrel index file. We will also need to define some constants to store the root Url for our data source service, and the specific endpoint we want to call to retrieve the list of members. We can do by adding the following lines.

```javascript
import { MemberEntity } from './model';

const baseRoot = 'https://api.github.com/orgs/lemoncode';
const membersURL = `${baseRoot}/members`
```

- We want to define a get/fetch REST call to retrieve our list of members from the server. In order to do this, we must send an aynchronous call to the server, using a Promise to store said data once it is available in our app. Thus, we define a `fetchMemberList` method that performs the aformentioned 'fetch' operation and parses the corresponding data, as follows: 

```javascript
export const fetchMemberList = () : Promise<MemberEntity[]> => {

  return fetch(membersURL)
            .then(checkStatus)
            .then(parseJSON)
            .then(resolveMembers)


}
```

- As noted in the code above, we will first fetch the results from our Url endpoint, and then we will first check that the data could be retrieved successfully, parse said data into JSON, and finally resolve said data according to the API data model we have defined.

- Regarding thee `checkStatus` method, we will simply forward the response if we got an OK reply from the Backend. Otherwise, we will throw an error according to the status received. Notice that we do not need to wrap the returned value inside a Promise (for example, using `Promise.resolve()`), as the `then` call already returns a promise resolved with the data returned. Thus, we can chain then properly without incurring any typing errors on behalf of Typescript.

```javascript
const checkStatus = (response : Response) : Response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    let error = new Error(response.statusText);
    throw error;
  }
}
```

- If the members data was retrieved succesfully, we then take the corresponding JSON content.

```javascript
const parseJSON = (response : Response) : any => {
  return response.json();
}

```

- And finally, for each object in our data list (i.e. for each member in our members list), we will retrieve the three values we are interested in (using destructuring to make the code more concise), build a new object with these 3 values (using the short syntax for property assignment, i.e. `{id, login, avatar_url} equals {id:id, login:login, avatar_url:avatar_url})`), and finally we 'cast' our object into our api data model, as we do meet the required interface (types match). 

```javascript
const resolveMembers = (data : any) : MemberEntity[] => {
  const members = data.map(
    ({id, login, avatar_url,}) => ({ id, login, avatar_url, } as MemberEntity)
  );

  return members;
}
```


- We have finished our API, now we need to do some changes on our container file and folder to properly expose the API to it.

- First, we will create a new file inside our `src/pages/members` folder called `mapper.ts`. This will be an auxiliary file that parses between our api data model and the view model used in our components. The code we need to add would be the following:

```javascript
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
```

- The method `mapMemberListFromModelToVm` is the one that actually maps the members list retrieved from the Backend into the data model used in our components. Internally, it will call `mapMemberFromModelToVm` to process and parse each member object inside the list. We do not need to use this parsing method outside of our container, so we will not be adding any methods from `mapper.ts` into the `index.ts` file of our container folder.

- The last steps remaining will revolve around changing the code of our `container.tsx` component to use the new API endpoint alongside our mapper's parsing method. First, we will start by adding the new dependencies to our file header.

```diff
  import * as React from 'react';
  import { MemberListPage } from './page';
  import { MemberEntity } from './viewModel';
+ import { fetchMemberList } from '../../api';
+ import { mapMemberListFromModelToVm } from './mapper';
```

- And finally, we will replace the hardcoded block of the `fetchMembers` method to use instead a call to our `fetchMemberList` API endpoint

```diff
  export class MemberListContainer extends React.Component<{}, State> {

    constructor(props) {
      super(props);
      this.state = { memberList: [] };
    }

    fetchMembers = () => {
-     setTimeout(() => {
-       this.setState({
-         memberList: [
-           {
-             id: 1,
-             name: 'John',
-             avatarUrl: 'https://avatars1.githubusercontent.com/u/1457912?v=4',
-           },
-           {
-             id: 2,
-             name: 'Martin',
-             avatarUrl: 'https://avatars2.githubusercontent.com/u/4374977?v=4',
-          },
-         ]
-       });
-     }, 500);
+     fetchMemberList().then((memberList) => {
+       this.setState({
+         memberList: mapMemberListFromModelToVm(memberList),
+       });
+     });
    }

```

Now if you execute `npm start` and go to `http://localhost:8080/`, you will see the list of members retrieved from our Url.
 
# About Lemoncode

We are a team of long-term experienced freelance developers, established as a group in 2010.
We specialize in Front End technologies and .NET. [Click here](http://lemoncode.net/services/en/#en-home) to get more info about us. 

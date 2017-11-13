# 01 Hardcoded list component

In this sample we are going to change our page component to add a hardcoded list of members.

We will use as start up point _00 Boilerplate_.

Summary steps:

- Define the view model.
- Create a component to show a table with a list of members.
- Create a component to show a row that is part of the table component.
- Modify the page component to show a table with hardcoded members.

# Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) if they are not already installed on your computer.

> Verify that you are running at least node v6.x.x and npm 5.x.x by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps to build it

- Copy the content of the `00 Boilerplate` folder to an empty folder for the sample.

- Install the npm packages described in the `package.json` and verify that it works:

```
npm install
```
  
- Let's define our view model. As we are later going to obtain a list of GitHub members, we specify that a member will have an id, a name and an avatar URL. Therefore, our _viewModel.ts_ file will contain:

```javascript
export interface MemberEntity {
  id : number;
  name : string;
  avatarUrl : string;
}
```

- Now, we are going to create a folder named _components_, under _members_ folder.

- Then, we will add some files for the components that we need to show a list of members in our page. Under _components_ folder, create _index.ts_, _memberRow.tsx_ and _memberTable.tsx_.

- The _src_ folder structure should be like the following one:

```
.
└── src/
    └── pages/
		└── members/
				├── components/
					├── index.ts
					├── memberRow.tsx
					└── memberTable.tsx
				├── index.ts
				├── viewModel.ts
				├── container.tsx
				└── page.tsx
	└── index.html
	└── main.tsx
```

- Let's create the component that will show a member's details in a row.
    - The properties of our component will include just a member.
    - Our component will return the HTML code that renders the member received in the properties argument.
    - Therefore, we need to add the following code to our _memberRow.tsx_ file:

```javascript
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
```

- Now, let's create the component that will show the list of members. To do so, we need to import the MemberRow component into _memberTable.tsx_ and render it accordingly. In this case, the properties will be an array of members:

```javascript
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
```

- Now, let's use barrel and export MemberTable in _./src/pages/members/components/index.ts_:

```javascript
export { MemberTable } from './memberTable';
```

- It's the moment to include our MemberTable in our _page.tsx_ component.
    - We need to import MemberEntity.
    - We need to define the properties: it will be the list of members.
    - We need to convert the component from a function into a class.

```diff
  import * as React from 'react';
+ import { MemberEntity } from './viewModel';
+ import { MemberTable } from './components';

+ interface Props {
+   memberList: MemberEntity[];
+   fetchMemberList: () => void;
+ }

- export const MemberListPage = () => (
-   <h1>Hello from member list page</h1>
- );

+ export class MemberListPage extends React.Component<Props, {}> {
+ 
+   render() {
+     return (
+       <MemberTable
+         memberList={this.props.memberList}
+       />
+     );
+   }
+ }

```

- Now, we have to modify _container.tsx_.
    - We need to import MemberEntity.
    - We need to define the State: it will be the list of members.
    - We need to convert the component from a function into a class.

```diff
  import * as React from 'react';
  import { MemberListPage } from './page';
+ import { MemberEntity } from './viewModel';

+ interface State {
+   memberList : MemberEntity[];
+ }

- export class MemberListContainer extends React.Component<{}, {}> {
-   render() {
-     return (
-       <MemberListPage/>
-     );
-   }
- }

+ export class MemberListContainer extends React.Component<{}, State> {
+ 
+   constructor(props) {
+     super(props);
+     this.state = { memberList: [] };
+   }
+   
+   render() {
+     return (
+       <MemberListPage
+         memberList={this.state.memberList}
+       />
+     );
+   }
+ }
```

- At this point, there is a piece missing: when our page is created, we need a call to get the list of members whenever it is ready. We will do it in _page.tsx_ using the method _componentDidMount()_.

```diff
  interface Props {
    memberList: MemberEntity[];
+   fetchMemberList: () => void;
  }

export class MemberListPage extends React.Component<Props, {}> {

+   componentDidMount() {
+     this.props.fetchMemberList();
+   }

    render() {
      return (
        <MemberTable
          memberList={this.props.memberList}
        />
      );
    }
  }
```

- Now, what we need to do is to simulate how to get the list of members. As it should normally be an asynchronous call, we will use a timeout to return a list of hardcoded members in _container.tsx_.

```diff
  export class MemberListContainer extends React.Component<{}, State> {

    constructor(props) {
      super(props);
      this.state = { memberList: [] };
    }

+   fetchMembers = () => {
+     setTimeout(() => {
+       this.setState({
+         memberList: [
+           {
+             id: 1,
+             name: 'John',
+             avatarUrl: 'https://avatars1.githubusercontent.com/u/1457912?v=4',
+           },
+           {
+             id: 2,
+             name: 'Martin',
+             avatarUrl: 'https://avatars2.githubusercontent.com/u/4374977?v=4',
+          },
+         ]
+       });
+     }, 500);
+   }

    render() {
      return (
        <MemberListPage
          memberList={this.state.memberList}
+         fetchMemberList={this.fetchMembers}
        />
      );
    }
  }
```

Now if you execute `npm start` and go to `http://localhost:8080/`, you will see the list of hardcoded members.
 
# About Lemoncode

We are a team of long-term experienced freelance developers, established as a group in 2010.
We specialize in Front End technologies and .NET. [Click here](http://lemoncode.net/services/en/#en-home) to get more info about us. 

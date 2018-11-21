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

_./src/pages/members/viewModel.ts_

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

- Let's add a container page that will take the responsiblity of loading data (right
now harcoded), this container will instantiate the inner page.

_./src/pages/members/container.tsx_

```javascript
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
```

- Now let's go to memberListPage we will:
  - Call the _fetchMemberList_ on _ComponentDidMount_ life cycle event.
  - Use the _memberList_ to display data in the component (right now we won't
  take care of the layout of the component).

_./src/pages/members/page.tsx_

```diff
import * as React from 'react';
+ import { MemberEntity } from './viewModel';

+ interface Props {
+   memberList: MemberEntity[];
+   fetchMemberList: () => void;
+ }


- export const MemberListPage = () => (
-  <h1>Hello from member list page</h1>
- );

+ export class MemberListPage extends React.Component<Props, {}> {
+ 
+   componentDidMount() {
+     this.props.fetchMemberList();
+   }
+
+   render() {
+     return (
+      <>
+        {this.props.memberList.map((member) => 
+        <h1 key={member.id}>{member.name}</h1>
+        )}
+      </>
+     );
+   }
+ }

```

- Time to replace the component we are displaying in _main.tsx_ file
(ensure we are pointing to the container in the _pages/members/index.ts_ barrel):

_./src/main.tsx_

```diff
import * as React from 'react';
import * as ReactDOM from 'react-dom';

+ import { MemberListContainer } from './pages/members'; 

ReactDOM.render(
+  <MemberListContainer />,
  document.getElementById('root')
);
```

- Hey! We got some results :-), let's start componentizing and creating the presentational 
components for this page.

- First of all the _page_ itself is doing too many things and on the other hand it
could be likely that we could use memberlist table in other pages, let's apply create
a _memberTable_ component.

_./src/pages/members/components/memberTable.tsx_

```tsx
import * as React from 'react';
import { MemberEntity } from '../viewModel';

interface Props {
  memberList : MemberEntity[];
}

export const MemberTable = (props : Props) => 
      <>
        {props.memberList.map((member) => 
        <h1 key={member.id}>{member.name}</h1>
        )}
      </>
```

- Let's create a barrel under components to expose clearly which components are
_"public"_

_./src/components/index.ts_

```typescript
export * from './memberTable';
```

- Let's use this new component in our page.

_./src/pages/members/page.tsx_

```diff
import * as React from 'react';
import { MemberEntity } from './viewModel';
+ import { MemberTable } from './components'

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
      <>        
-        {this.props.memberList.map((member) => 
-        <h1 key={member.id}>{member.name}</h1>
+        <MemberTable memberList={this.props.memberList} />
        )}
      </>
    );
  }
}
```

- Now it's time to focus on the layout, let's first try to create the table in one component:

_./src/pages/members/components/memberTable.tsx_

```diff
import * as React from 'react';
import { MemberEntity } from '../viewModel';

interface Props {
  memberList : MemberEntity[];
}

export const MemberTable = (props : Props) => 
      <>
-        {props.memberList.map((member) => 
-        <h1 key={member.id}>{member.name}</h1>
-         )}
+        <table className="table">
+          <thead>
+            <tr>
+              <th>Picture</th>
+              <th>Id</th>
+              <th>Name</th>
+            </tr>
+          </thead>
+          <tbody>
+            {
+              props.memberList.map(
+                (member) =>   
+                    <tr key={member.id}>
+                      <td><img src={member.avatarUrl} style={{ width: '200px' }} /></td>
+                      <td>{member.id}</td>
+                      <td>{member.name}</td>
+                    </tr>
+              )
+            }
+          </tbody>
+        </table>
      </>
```

- Not bad we got a table component showing the results, but if we take a look to this component
there's still room for improvement, the map to get the rows is a bit hard to read why not 
encapsulate it in a new component?

_./src/components/memberRow.tsx_

```tsx
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

> Side note here: we could encapsulate it and place it in the same file, room for discussion here.

- And let's use this component in the _MemberTable_ component.

_./src/pages/members/components/memberTable.tsx_

```diff
import * as React from 'react';
import { MemberEntity } from '../viewModel';
+ import { MemberRow } from './memberRow';

interface Props {
  memberList : MemberEntity[];
}

export const MemberTable = (props : Props) => 
      <>
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
                (member) =>   
+                    <MemberRow key={member.id} member={member} />
-                    <tr key={member.id}>
-                      <td><img src={member.avatarUrl} style={{ width: '200px' }} /></td>
-                      <td>{member.id}</td>
-                      <td>{member.name}</td>
-                    </tr>
              )
            }
          </tbody>
        </table>
      </>
```

> Excercise: we could go one step further and encapsulate the headings in a subcomponent,
makes sense?

Now if you execute `npm start` and go to `http://localhost:8080/`, you will see the list of hardcoded members.
 
# About Lemoncode

We are a team of long-term experienced freelance developers, established as a group in 2010.
We specialize in Front End technologies and .NET. [Click here](http://lemoncode.net/services/en/#en-home) to get more info about us. 

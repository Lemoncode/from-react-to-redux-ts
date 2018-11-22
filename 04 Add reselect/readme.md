# 04 Add reselect

In this sample, we are going to add reselect to our project. In _container.tsx_ we are mapping between two MemberEntity interfaces, the one defined within our API (_member.ts_) and the one defined within our page (_viewModel.ts_). But it is not advisable to map those entities in _container.tsx_ because it is a calculated field and also because the app could grow and paths may change.

We will use as start up point _03 Add redux_.

Summary steps:

- Install reselect.
- Add selectors to reducer.
- Add selectors to page.

# Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) if they are not already installed on your computer.

> Verify that you are running at least node v8.x.x and npm 5.x.x by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps to build it

- Copy the content of the `03 Add redux` folder to an empty folder for the sample.

- Install the npm packages described in the `package.json` and verify that it works:

```
npm install
```

- Now, we are going to install reselect.

```
npm install reselect --save
```

- Then, we will add a new file named _selectors.ts_ within _reducers_ folder.

```
└── reducers/
  ├── index.ts
  ├── memberListReducer.ts
  └── selectors.ts
```

- A selector is a function that receives a state and returns the part of the state that we are interested in. Let's add a selector in _selectors.ts_ to get the list of members given the state:

_./reducers/selectors.ts_

```javascript
import { State } from './index'; // This is not a good idea because it could create a circular reference, but we'll leave it like that for now

// To be able to access state.memberListReducer from a different path in case the app grows and we need to relocate our reducer.
export const getMemberListReducer = 
  (state : State) => state.memberListReducer;
```

- This is interesting in case the app grows because we could need to relocate our reducer and the selector provides a single entry point to _memberListReducer_.

- Now, let's add another selector to get the list of members from _memberListReducer_:

_./reducers/selectors.ts_

```diff
import { State } from './index'; // This is not a good idea because it could create a circular reference, but we'll leave it like that for now
+ import { MemberListState } from './memberListReducer';

// To be able to access state.memberListReducer from a different path in case the app grows and we need to relocate our reducer.
export const getMemberListReducer = 
  (state : State) => state.memberListReducer;

+ export const getMemberList =
+   (memberListReducer : MemberListState) => memberListReducer.memberList; 
```

- Let's change _container.tsx_ to use our selectors:

_./src/pages/container.tsx_

```diff
+ import { getMemberList, getMemberListReducer } from '../../reducers/selectors';

const mapStateToProps = (state: State) => ({
-   // This mapping is necessary because we have two different ModelEntity interfaces with the same name.
-   // This could be improved using selectors.
-   memberList: mapMemberListFromModelToVm(state.memberListReducer.memberList),
+   memberList: mapMemberListFromModelToVm(getMemberList(getMemberListReducer(state))), 
});
```

- However, we are using _getMemberList_ and _getMemberListReducer_ in _container.tsx_. This could be improved by using reselect. To do that, let's change _selectors.ts_:

_./src/reducers/selector.tsx_

```diff
+ import { createSelector } from 'reselect';
import { State } from './index'; // This is not a good idea because it could create a circular reference, but we'll leave it like that for now
import { MemberListState } from './memberListReducer';

// To be able to access state.memberListReducer from a different path in case the app grows and we need to relocate our reducer.
export const getMemberListReducer = 
  (state : State) => state.memberListReducer;

- export const getMemberList =
-   (memberListReducer : MemberListState) => memberListReducer.memberList; 
+ export const getMemberList =  createSelector(
+   getMemberListReducer, 
+   (memberListReducer) => memberListReducer.memberList
+ );
```

- Then, let's adapt _container.tsx_:

```diff
- import { getMemberList, getMemberListReducer } from '../../reducers/selectors';
import { getMemberList } from '../../reducers/selectors';

const mapStateToProps = (state: State) => ({
-   memberList: mapMemberListFromModelToVm(getMemberList(getMemberListReducer(state))), 
+   memberList: mapMemberListFromModelToVm(getMemberList(state)), 
});
```

- We see that we no longer need the call to _getMemberListReducer_.

- At this point, we are going to do an extra step. We are calling _mapMemberListFromModelToVm_ within _container.tsx_ but it is not recommended to do that, because it calculates a field and is called every time the component is rendered. Therefore, we are going to create a new file named _selectors.ts_ within _src/pages/members_ that will access locally to the stuff managed by the page:

```
└── pages/
  └── members/
    ├── components/
    ├── index.ts
    ├── container.tsx
    ├── mapper.ts
    ├── page.tsx
    ├── viewModel.ts
    └── selectors.ts
```

- It is in _selectors.ts_ where we will call __mapMemberListFromModelToVm_. We create a selector that will receive a member list and will return its mapping:

_./src/pages/members/selectors.ts_

```javascript
import { createSelector } from 'reselect';
import { getMemberList } from '../../reducers/selectors';
import { mapMemberListFromModelToVm } from './mapper';

export const getMemberListVM = createSelector(
  getMemberList, 
  (memberList) => mapMemberListFromModelToVm(memberList), 
);
```

- Let's use this selector in _container.tsx_:

_./src/pages/members/container.tsx_

```diff
- import { MemberEntity } from './viewModel';
- import { mapMemberListFromModelToVm } from './mapper';
- import { getMemberList } from '../../reducers/selectors';
+ import { getMemberListVM } from './selectors';

const mapStateToProps = (state: State) => ({
-   memberList: mapMemberListFromModelToVm(getMemberList(state)), 
+   memberList: getMemberListVM(state), 
});
```

- Apart from the improved design, this selectors provide other advantages. For example, they make components easier to test and they also improve performance, because _createSelector_ implements the memoize pattern, which returns a cached result for the same input.

Now if you execute `npm start` and go to `http://localhost:8080/`, you should keep seeing the list of members retrieved from our URL.
 
# About Lemoncode

We are a team of long-term experienced freelance developers, established as a group in 2010.
We specialize in Front End technologies and .NET. [Click here](http://lemoncode.net/services/en/#en-home) to get more info about us. 

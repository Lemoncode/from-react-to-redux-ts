# 03 Add redux

In this sample, we are going to add redux to our project. Redux helps managing the state of the application and that is convenient specially in the case of large apps. There will be one single store that stores the state of the whole application as a tree. The state is read-only and can only be changed by actions through reducers.

We will use as start up point _02 create API and expose it in Container_.

Summary steps:

- Install redux dependencies.
- Add const folder to identify our actions.
- Create actions folder and add our actions there.
- Add reducer.
- Create the store to keep the state of the app.
- Modify the container to map its properties. 
- Use a provider to inject the store.

# Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) if they are not already installed on your computer.

> Verify that you are running at least node v6.x.x and npm 5.x.x by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps to build it

- Copy the content of the `02 create API and expose it in Container` folder to an empty folder for the sample.

- Install the npm packages described in the `package.json` and verify that it works:

```
npm install
```

- Now, we are going to install redux and react-redux.

```
npm install redux react-redux --save
```

- Let's install the type definitions for react-redux as well:

```
npm install @types/react-redux --save-dev
```

- We will also need the middleware redux-thunk to handle the asynchronous call to the Rest API.

```
npm install redux-thunk --save
```

- Now, we are going to create the folder structure that we will need. There will be three new folders under _src_: _actions_, _const_ and _reducers_.
```
└── src/
  └── actions/
	├── api/
	├── const/
	├── pages/
	└── reducers/
```

- Then, we will add two new files to _const_ folder: _actionsDefs.ts_ and _index.ts_.

```
└── const/
  ├── index.ts
  └── actionsDefs.ts
```

  - In _actionsDefs.ts_ we will have some string consts to identify our actions:

```javascript
const prefix = 'MEMBERS_MODULE';

export const actionsDefs = {
  FETCH_MEMBERS_COMPLETED: `[${prefix}][1] Member Fetching Completed fetchMembersCompleted`,
}
```

  - We will use barrel to export our const in _index.ts_:

```javascript
export { actionsDefs } from './actionsDefs';
```

- Next step is to add our actions. We will create two new files under _actions_ folder:

```
└── actions/
  ├── index.ts
  └── fetchMemberList.ts
```

- In _fetchMemberList.ts_ we will need to import the action definitions that we created in previous step, the member model that we defined for our API and, finally, the function fetchMemberList from our API:

_./src/actions/fetchMemberList.ts_

```javascript
import { MemberEntity } from '../api/model';
import { actionsDefs } from '../const';
import { fetchMemberList } from '../api'; 
```

  - As our action is an asynchronous call to an API, we need two functions: one to start the request to the server and a callback once the request is completed. The first function will be named _fetchMemberListRequestStart_ and it is the one that we will export. This function will call _fetchMemberList()_ from our API, but it returns a promise, which is not a pure function. This means that we cannot return it directly to the reducer. A dispatcher is the solution to this problem. The access to the dispatcher within the action is provided by redux-thunk middleware. The dispatcher does the magic that allows to insert the result of actions into the reducers wheel. Precisely, the second function that we need is the one provided to the dispatcher. It returns the result of the action, which is the list of members, once the request to the API is completed:

_./src/actions/fetchMemberList.ts_

```diff
import { MemberEntity } from '../api/model';
import { actionsDefs } from '../const';
import { fetchMemberList } from '../api'; 

+ export const fetchMemberListRequestStart = () => (dispatcher) => {
+   const promise = fetchMemberList();
+ 
+   promise.then((memberList) => {
+     dispatcher(fetchMemberListCompleted(memberList));
+   });
+ }
+ 
+ const fetchMemberListCompleted = (memberList : MemberEntity[]) => ({
+   type: actionsDefs.FETCH_MEMBERS_COMPLETED,
+   payload: memberList,
+ });
```

- Again, we use barrel to export our action in _index.ts_:

```javascript
export { fetchMemberListRequestStart } from './fetchMemberList';
```

- Now, it is time to define our reducer. A reducer is a pure function that, given the previous state and an action, returns the next state of the app. Under _reducers_ folder, we are going to create two new files: _memberListReducer.ts_ and _index.ts_.

```
└── reducers/
  ├── index.ts
  └── memberListReducer.ts
```

  - In _memberListReducer.ts_ we will add our reducer. It will need the action definitions from _const_ folder as well as the member model. The reducer is splitted into a state, which is the list of members, and an action interface. The action object is composed of the name of the action (_type_ field) and the result of the action (_payload_ field). The type of the action is always necessary. _Payload_ field is optional and it is needed when the action modifies or returns data. So let's add them:

```javascript
import { MemberEntity } from '../api/model';
import { actionsDefs } from '../const';

// We create an object showing how spread operator (...) works because it helps keeping the object inmutable,
// but we could have set the state directly to an array of members.
export interface MemberListState {
  memberList : MemberEntity[];
}

// The interface BaseAction could be promoted to a common file and be reused in other reducers
interface BaseAction {
  type : string;
  payload : any;
}
```

- It is convenient to define a default state, that is represented by an empty list of members:

```diff
import { MemberEntity } from '../api/model';
import { actionsDefs } from '../const';

// We create an object showing how spread operator (...) works because it helps keeping the object inmutable,
// but we could have set the state directly to an array of members.
export interface MemberListState {
  memberList : MemberEntity[];
}

// The interface BaseAction could be promoted to a common file and be reused in other reducers
interface BaseAction {
  type : string;
  payload : any;
}

+ const createDefaultState = () => ({
+   memberList: [],
+ });
```

- The reducer is a function that receives a state and an action and returns a new state. Therefore, in our case, we need to check that the action type is correct and return the new state. As the state is inmutable, we create a new object with the member list received from the API:

```diff
import { MemberEntity } from '../api/model';
import { actionsDefs } from '../const';

// We create an object showing how spread operator (...) works because it helps keeping the object inmutable,
// but we could have set the state directly to an array of members. 
export interface MemberListState {
  memberList : MemberEntity[];
}

// The interface BaseAction could be promoted to a common file and be reused in other reducers
interface BaseAction {
  type : string;
  payload : any;
}

const createDefaultState = () => ({
  memberList: [],
});

+ export const memberListReducer = (state : MemberListState = createDefaultState(), action : BaseAction) : MemberListState => {
+   switch (action.type) {
+     case actionsDefs.FETCH_MEMBERS_COMPLETED:
+       // Return the new state
+       return handleFetchMembersCompleted(state, action.payload);
+   }
+ 
+   return state;
+ }
+ 
+ const handleFetchMembersCompleted = (state : MemberListState, memberList : MemberEntity[]) : MemberListState => ({
+ // We could have simply returned the list of members, but we are returning an object with the list of members 
+ // using spread operator to show how it helps keeping objects inmutable
+   ...state,
+   memberList,
+ });
```

  - Although we only have one reducer, we are going to use _combineReducers_ in _index.ts_ to transform an object with several reducers into a single reducer. This is convenient for large apps, but we will use it to show it. We need to import _combineReducers_ from redux and also the reducer and the state that we exported in _memberListReducer.ts_. Then, we will create the state, which contains the states of all our reducers, and the single reducer function which is the result of _combineReducers_.

```javascript
import { combineReducers } from 'redux';
import { memberListReducer, MemberListState } from './memberListReducer';

export interface State {
  memberListReducer : MemberListState; 
}

export const reducers = combineReducers<State>({
  memberListReducer,
});
```

- At this point, we need to create a new file named _store.ts_ under _src_ folder:

  ```
  └── src/
    └── actions/
	  ├── api/
	  ├── const/
	  ├── pages/
	  ├── reducers/
    ├── index.html
    ├── main.tsx
    └── store.ts
  ```

  - The store contains the state tree of our application. We'll also include the middleware for asynchronous calls. In addition, we will use _composeEnhancers_ to activate redux dev tools if it is installed and we are not in a production environment. 

_./src/store.ts_

```javascript
import { createStore, applyMiddleware, compose} from 'redux';
import reduxThunk from 'redux-thunk';
import { reducers } from './reducers';

const middlewares = [
  reduxThunk,
];

const composeEnhancers = (process.env.NODE_ENV !== 'production' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ? 
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ :
  compose;

export const store = createStore(
  reducers,
  composeEnhancers(
    applyMiddleware(...middlewares),
  ),
);
```

- Now, we need to modify _container.tsx_ which is under _./src/pages/members/_. We'll do it step by step:
  
  - At first, we have to change the importations to add redux, the reducer, the actions, etc.

_./src/pages/members/container.tsx_

```diff
import * as React from 'react';
+ import { connect } from 'react-redux';
+ import { State } from '../../reducers';
import { MemberListPage } from './page';
import { MemberEntity } from './viewModel';
- import { fetchMemberList } from '../../api';
+ import * as memberApi from '../../api';
import { mapMemberListFromModelToVm } from './mapper';
+ import { fetchMemberListRequestStart } from '../../actions';
```

- Then, it is necessary to map the properties of the container to the state and actions of the reducer:

```diff
- interface State {
-   memberList : MemberEntity[];
- }
+
+ const mapStateToProps = (state : State) => ({
+   // This mapping is necessary because we have two different ModelEntity interfaces with the same name.
+   // This could be improved using selectors.
+   memberList: mapMemberListFromModelToVm(state.memberListReducer.memberList),
+ });
+
+ const mapDispatchToProps = (dispatch) => ({
+   fetchMemberList: () => { dispatch(fetchMemberListRequestStart()) }
+ });
```

  - Now, we see that in previous projects we had exported a class extending _React.Component_, but we don't need our container component to be a class anymore. We can simply export our container as the result of the _connect_ function. This function does the magic, it maps properties and callbacks to our page container:

```diff
- export class MemberListContainer extends React.Component<{}, State> {
-
-   constructor(props) {
-     super(props);
-     this.state = { memberList: [] };
-   }
-
-  fetchMembers = () => {
-    fetchMemberList().then((memberList) => {
-      this.setState({
-        memberList: mapMemberListFromModelToVm(memberList),
-       });
-    });
-   }
-
-   render() {
-     return (
-      <MemberListPage
-         memberList={this.state.memberList}
-         fetchMemberList={this.fetchMembers}
-       />
-     );
-   }
- }
+
+ export const MemberListContainer = connect(
+   mapStateToProps,
+   mapDispatchToProps,
+ )(MemberListPage);
```

- The final content of _container.tsx_ should be like below:

```javascript
import * as React from 'react';
import { connect } from 'react-redux';
import { State } from '../../reducers';
import { MemberListPage } from './page';
import { MemberEntity } from './viewModel';
import * as memberApi from '../../api';
import { mapMemberListFromModelToVm } from './mapper';
import { fetchMemberListRequestStart } from '../../actions';

const mapStateToProps = (state: State) => ({
  // This mapping is necessary because we have two different ModelEntity interfaces with the same name.
  // This could be improved using selectors.
  memberList: mapMemberListFromModelToVm(state.memberListReducer.memberList),
});

const mapDispatchToProps = (dispatch) => ({
  fetchMemberList: () => { dispatch(fetchMemberListRequestStart()) }
});

export const MemberListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MemberListPage);
```

- Finally, _main.tsx_ has to be modified, because our container component needs to access the redux store. To do that, we will use the _Provider_ component, which allows all components to have access to the store (the store is injected into the context of every component).

```diff
import * as React from 'react';
import * as ReactDOM from 'react-dom';
+ import { Provider } from 'react-redux';
+ import { store } from './store';
import { MemberListContainer } from './pages/members'; 

ReactDOM.render(
-   <MemberListContainer />,
+     <>
+       <MemberListContainer />
+     </>
+   </Provider>,
  document.getElementById('root')
);
```

Now if you execute `npm start` and go to `http://localhost:8080/`, you will see the list of members retrieved from our URL.
 
# About Lemoncode

We are a team of long-term experienced freelance developers, established as a group in 2010.
We specialize in Front End technologies and .NET. [Click here](http://lemoncode.net/services/en/#en-home) to get more info about us. 

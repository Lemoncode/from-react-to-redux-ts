import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { MemberListContainer } from './pages/members'; 

ReactDOM.render(
  <Provider store={store}>
    <MemberListContainer />
  </Provider>,
  document.getElementById('root')
);

import React from 'react';
import { Provider } from "react-redux";
import { HistoryRouter as Router } from "redux-first-history/rr6";

import { store, history } from "./store";

export const App = () => {
    return (
      <Provider store={store}>
        <Router history={history}>
          <div>{'react-18 redux starter'}</div>
        </Router>
      </Provider>
    );
}
;

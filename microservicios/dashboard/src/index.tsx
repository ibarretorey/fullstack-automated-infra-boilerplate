import React from 'react';
import ReactDOM from 'react-dom';

import '@patternfly/react-core/dist/styles/base.css';

import './index.css';
import * as serviceWorker from './serviceWorker';
import Root from './pages/Root';
import { init } from './components/Keycloak'

// Initialize the Keycloak client
init();

ReactDOM.render(<Root/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

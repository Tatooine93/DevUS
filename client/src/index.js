import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.scss';
import { Provider } from 'react-redux';
import { applyMiddleware, legacy_createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer  from './reducers';

// dev tools
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';


const store = legacy_createStore ( // se renseigner pour utilise configureStore au lieu de createStore !!!
  rootReducer, composeWithDevTools(applyMiddleware(thunk, logger)) // remove in production !!!
) 


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

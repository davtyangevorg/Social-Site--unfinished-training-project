import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from 'react-router-dom'
import store from './redux/store.ts'
import {Provider} from 'react-redux'

import {instance} from './api.ts'
import {isAuthActionCreator,getUserProfileInfo} from './redux/auth-reduser.js'
console.log('index')
instance.get('auth/me').then((res)=>{
  if(res.data.resultCode===0){
    store.dispatch(isAuthActionCreator())
    instance.get(`profile/${res.data.data.id}`).then((response)=>{
      store.dispatch(getUserProfileInfo(response.data))
    }).then(()=>{
      ReactDOM.render(
        <React.StrictMode>
          <Provider store={store}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </Provider>
        </React.StrictMode>,
        document.getElementById('root')
      );
    })
    return
  } 
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  );
})



serviceWorker.unregister();
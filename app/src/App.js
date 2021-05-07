import React from 'react';
import './App.scss';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './Redux/store';
import Main from './Screens/Main';

export default function App() {
  
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  )
}
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/header/header';

ReactDOM.render(
    <Provider store={ store }>
        <BrowserRouter>
            <Header />
            <App />
        </BrowserRouter>
    </Provider>
    , document.getElementById('root'));
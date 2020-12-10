import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Header from './components/header/header';

// import 'primereact/resources/themes/nova-light/theme.css';
// import 'primereact/resources/primereact.min.css';

const history = createBrowserHistory({
    basename: process.env.PUBLIC_URL
});

ReactDOM.render(
    <Provider store={ store }>
        <BrowserRouter history={history}>
            <Header />
            <App />
        </BrowserRouter>
    </Provider>
    , document.getElementById('root'));
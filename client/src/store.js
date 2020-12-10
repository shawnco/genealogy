import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';

const middleWare = applyMiddleware(thunk);
const store = createStore(reducer, middleWare);
export default store;
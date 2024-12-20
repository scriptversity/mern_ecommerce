import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
// import {cartReducer} from './reducers/cartReducers';
import { productsReducer, productDetailsReducer } from './reducers/productReducers';

const reducer = combineReducers({
  // cart: cartReducer,
  products: productsReducer,
  productDetails: productDetailsReducer,
});

let initialState = {};
const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
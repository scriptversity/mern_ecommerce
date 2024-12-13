import {
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,
  CLEAR_ERRORS,
} from "../constants/productConstants";

const initialState = {
  products: [],
  loading: false,
  error: null,
  productsCount: 0, // Added productsCount to initialState
};

export const productsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ALL_PRODUCTS_REQUEST:
      return {
        ...state, // Maintain the existing state properties
        loading: true,
        products: [],
      };

    case ALL_PRODUCTS_SUCCESS:
      return {
        ...state, // Maintain the existing state properties
        loading: false,
        products: payload.products,
        productsCount: payload.productsCount,
        // resPerPage: payload.resPerPage,
        // filteredProductsCount: payload.filteredProductsCount,
      };

    case ALL_PRODUCTS_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

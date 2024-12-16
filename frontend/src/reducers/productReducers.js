import {
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,
  CLEAR_ERRORS,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
} from "../constants/productConstants";

// Initial state for products reducer
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

// Initial state for product details reducer
const productDetailsInitialState = {
  product: {},
  loading: false,
  error: null,
};

export const productDetailsReducer = (state = productDetailsInitialState, { type, payload }) => {
  switch (type) {
    case PRODUCT_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case PRODUCT_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        product: payload,
      };
    case PRODUCT_DETAILS_FAIL:
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

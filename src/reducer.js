import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

const items = (state = { arr: [], loading: false, sumStockPrice: '', selectedDiscount: 0.65, inputStockPrice: '', inputStockAmount: '' }, action) => {
  switch (action.type) {
    case 'SHOW_SPINNER':
      {
        return { ...state, loading: true };
      }
    case 'HIDE_SPINNER':
      {
        return { ...state, loading: false };
      }
    case 'GET_GITHUB_SUCCESS':
      {
        return { ...state, data: action.payload.data };
      }
    case 'CHAGE_USER_ID':
      {
        return { ...state, userId: action.payload.userId };
      }
    case 'CHAGE_TEXT':
      {
        return { ...state, text: action.payload.text };
      }
    case 'ADD_ITEM':
      {
        return { ...state, arr: [...state.arr, action.payload] };
      }
    case 'DEL_ITEM':
      {
        return { ...state, arr: state.arr.filter(item => item.id !== action.id) };
      }
    case 'CHAGE_STOCK_PRICE':
      {
        return { ...state, inputStockPrice: action.payload.price };
      }
    case 'CAL_RESULT':
      {
        return { ...state, sumStockPrice: action.payload.result };
      }
    case 'CHAGE_DISCOUNT':
      {
        return { ...state, selectedDiscount: action.payload.discount };
      }
    case 'CHAGE_AMOUNT':
      {
        return { ...state, inputStockAmount: action.payload.amount };
      }
    default:
      return state;
  }
};

const reducer = combineReducers({
  items,
  routing: routerReducer
});

export default reducer;
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

const stockInfo = [
  { stockId: '2456', stockName: '奇力新', news: 'https://www.cmoney.tw/follow/channel/stock-2456?chart=d' },
  { stockId: '5317', stockName: '凱美', news: 'https://www.cmoney.tw/follow/channel/stock-5317?chart=d' },
  { stockId: '2375', stockName: '智寶', news: 'https://www.cmoney.tw/follow/channel/stock-2375?chart=d' },
  { stockId: '2478', stockName: '大毅', news: 'https://www.cmoney.tw/follow/channel/stock-2478?chart=d' },
  { stockId: '2327', stockName: '國巨', news: 'https://www.cmoney.tw/follow/channel/stock-2327?chart=d' }
];

const items = (state = { arr: [], loading: false, sumStockPrice: '', selectedDiscount: 0.65, inputStockPrice: '', inputStockAmount: '', inputStockId: '', stockList: stockInfo }, action) => {
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
    case 'INSERT_STOCK_ID_LIST':
      {
        let stockId = action.payload.stockId;
        let arr = [];
        Object.assign(arr, state.stockList);
        if (!arr.find(stockVO => { return stockVO.stockId == stockId; })) {
          arr.push({ stockId, stockName: '', news: 'https://www.cmoney.tw/follow/channel/stock-' + stockId + '?chart=d' });
        }
        return { ...state, stockList: arr };
      }
    case 'CHAGE_STOCK_ID':
      {
        return { ...state, inputStockId: action.payload.stockId };
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
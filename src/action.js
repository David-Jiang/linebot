import 'whatwg-fetch';
import { browserHistory } from 'react-router';

export const showSpinner = () => ({ type: 'SHOW_SPINNER' });

export const hideSpinner = () => ({ type: 'HIDE_SPINNER' });

export const insertToList = (stockId, inputStockIdRef) => {
  return (dispatch) => {
    if (isNaN(stockId) || !stockId || stockId.length != 4) {
      alert('輸入之股票代號格式有誤，請重新輸入');
      inputStockIdRef.focus();
      dispatch({ type: 'CHAGE_STOCK_ID', payload: { stockId: '' } });
      return;
    }
    fetch('https://stock-backend.herokuapp.com/updateStockInfo', {
      body: stockId
    })
      .then(function (response) {
        if (response.resMessage) {
          return Promise.reject();
        } else {
          alert('新增成功');
        }
      })
      .catch((response = '新增股票清單發生錯誤') => {
        alert(response);
      });
  };
};

export const changeStockId = (event) => ({ type: 'CHAGE_STOCK_ID', payload: { stockId: event.target.value } });

export const getStockInfo = () => {
  return (dispatch) => {
    fetch('https://stock-backend.herokuapp.com/getStockInfo')
      .then((response) => {
        if (response.resMessage) {
          return Promise.reject(new Error(response.resMessage));
        } else {
          return response.json();
        }
      })
      .then(json => {
        dispatch({ type: 'INIT_STOCK_LIST', payload: { stockList: json } });
      })
      .catch((response = '查詢股票清單發生錯誤') => {
        alert(response);
      });
  };
};








export const changeStockPrice = (event) => ({ type: 'CHAGE_STOCK_PRICE', payload: { price: event.target.value } });

export const calculate = (price, discount, amount, isCharge, inputStockPriceRef, inputStockAmountRef) => {
  return (dispatch) => {
    if (isNaN(price) || !price) {
      alert('輸入之價格格式有誤，請重新輸入');
      inputStockPriceRef.focus();
      dispatch({ type: 'CHAGE_STOCK_PRICE', payload: { price: '' } });
      dispatch({ type: 'CAL_RESULT', payload: { result: '' } });
      return;
    }
    if (isNaN(amount) || !amount) {
      alert('輸入之張數格式有誤，請重新輸入');
      inputStockAmountRef.focus();
      dispatch({ type: 'CHAGE_AMOUNT', payload: { amount: '' } });
      return;
    }
    price = parseInt(price);
    let fee = (price * amount * 1000) * 0.001425 * discount;
    if (fee < 20) {
      fee = 20;
    }
    fee = Math.round(fee);
    fee *= 2;

    let sum = fee;
    if (isCharge) {
      sum += (price * amount * 1000) * 0.0015;
    } else {
      sum += (price * amount * 1000) * 0.003;
    }
    dispatch({ type: 'CAL_RESULT', payload: { result: Math.round(sum) } });
  };
};

export const changeDiscount = (discount) => ({ type: 'CHAGE_DISCOUNT', payload: { discount: discount.value } });

export const changeStockAmount = (event) => ({ type: 'CHAGE_AMOUNT', payload: { amount: event.target.value } });

export const reset = () => {
  return (dispatch) => {
    dispatch({ type: 'CHAGE_STOCK_PRICE', payload: { price: '' } });
    dispatch({ type: 'CHAGE_AMOUNT', payload: { amount: '' } });
    dispatch({ type: 'CHAGE_DISCOUNT', payload: { discount: 0.65 } });
    dispatch({ type: 'CAL_RESULT', payload: { result: '' } });
  };
};
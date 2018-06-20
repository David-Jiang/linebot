import 'whatwg-fetch';
import { browserHistory } from 'react-router';

export const showSpinner = () => ({ type: 'SHOW_SPINNER' });

export const hideSpinner = () => ({ type: 'HIDE_SPINNER' });

export const getGithub = (userId = '大同') => {
  return (dispatch) => {
    dispatch(showSpinner());
    fetch('http://125.227.131.127/caseSearch/list/QueryCsmmCaseList/queryCsmmCaseList.do?lineBot=Y&regUnitCode=31&queryData=' + userId)
      .then(function (response) { return response.json(); })
      .then(function (json) {
        dispatch({ type: 'GET_GITHUB_SUCCESS', payload: { data: json } });
        dispatch(hideSpinner());
        browserHistory.push('/first');
      })
      .catch(function (response) { dispatch({ type: 'GET_GITHUB_FAIL' }); });
  };
};

export const changeUserId = (event) => ({ type: 'CHAGE_USER_ID', payload: { userId: event.target.value } });

export const handleTextChange = (event) => ({ type: 'CHAGE_TEXT', payload: { text: event.target.value } });

export const handleItemAdd = (text) => {
  let obj = {
    id: new Date(),
    text
  };
  return (
    { type: 'ADD_ITEM', payload: obj }
  );
};

export const handleItemDel = (id) => ({ type: 'DEL_ITEM', id });

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
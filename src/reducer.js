import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

const items = (state = [], action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      {
        return [{
          id: action.payload.id,
          text: action.payload.text,
        }, ...state];
      }

    case 'DEL_ITEM':
      {
        return state.filter(item => item.id !== action.id);
      }
    case 'INCREASE':
      {
        state = isNaN(state) ? 0 : state;
        return state = (parseInt(state) + parseInt(action.amount));
      }
    case 'DECREASE':
      {
        state = isNaN(state) ? 0 : state;
        return state = (parseInt(state) - parseInt(action.amount));
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
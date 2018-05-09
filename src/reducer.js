import { combineReducers } from 'redux';

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

    default:
      return state;
  }
};

const itemApp = combineReducers({
  items,
});

export default itemApp;
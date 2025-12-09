import { combineReducers } from '@reduxjs/toolkit';
import * as reducers from './slices';

const rootReducer = combineReducers({
  ...reducers,
});

export default rootReducer;

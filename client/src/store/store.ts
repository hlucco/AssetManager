import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import classReducer from "./classSlice";
import plaidReducer from "./plaidSlice";
import coinbaseReducer from "./coinbaseSlice";
import userReducer from "./userSlice";
import totalValueReducer from "./totalValueSlice";

export const store = configureStore({
  reducer: {
    classReducer: classReducer,
    plaidReducer: plaidReducer,
    coinbaseReducer: coinbaseReducer,
    userReducer: userReducer,
    totalValueReducer: totalValueReducer,
  },
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();

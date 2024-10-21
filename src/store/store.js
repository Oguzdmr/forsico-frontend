import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import workspaceReducer from "./workspaceSlice";
import notificationReducer from "./notificationSlice";
import selectedComponentReducer from "./selectedComponentSlice";
//import boardsSlice from "./boardsSlice";
//boards: boardsSlice.reducer,

export const store = configureStore({
  reducer: {
    auth: authReducer,
    selectedComp: selectedComponentReducer,
    workspaces: workspaceReducer,
    notifications: notificationReducer,
  },
});

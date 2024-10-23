import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import BoardApi from "../api/BoardApi/board";

export const fetchBoard = createAsyncThunk(
  "board/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth?.token?.token;
    const board = new BoardApi();

    try {
      const response = await board.getBoard(token, _.workspaceId, _.boardId);
      console.log("res data",response.data)
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

const boardSlice = createSlice({
  name: "board",
  initialState: {
    entities: [],
    status: "idle",
    error: null,
  },
  reducers: {
    updateStatus: (state, action) => {
        console.log("dispatch works",action.payload.status)
      state.status = action.payload.status;
    },
    dragTask: (state, action) => {
        const { colIndex, prevColIndex, taskIndex } = action.payload;
        const prevCol = state.entities.lists.find((col, i) => i === prevColIndex);
        const task = prevCol.tasks.splice(taskIndex, 1)[0];
        state.entities.lists.find((col, i) => i === colIndex).tasks.push(task);
      },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBoard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entities = action.payload;
      })
      .addCase(fetchBoard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
 
});

export const { updateStatus,dragTask } = boardSlice.actions;
export default boardSlice.reducer;

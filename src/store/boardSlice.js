import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import BoardApi from "../api/BoardApi/board";

export const fetchBoard = createAsyncThunk(
  "board/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth?.token?.token;
    const board = new BoardApi();

    try {
      const response = await board.getBoard(token, _.workspaceId, _.boardId);
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
      state.status = action.payload.status;
    },
    addList: (state, action) => {
      state.entities.lists.push({
        _id: action.payload._id,
        name: action.payload.name,
        color: action.payload.color,
        tasks: [],
      });
    },
    addTask: (state, action) => {
      state.entities.lists.filter((x) => x._id === action.payload.listId)[0].tasks.push({
        "_id":action.payload.taskId,
        "name": action.payload.name,
        "description": action.payload.description,
        "boardId": action.payload.boardId,
        "listId": action.payload.listId,
        "assignee": action.payload.userId,
        "ownerId": action.payload.userId,
        "priority": 0,
        "parentTask": action.payload.parentId
      });
      state.entities.lists.filter((x) => x._id === action.payload.listId)[0].tasks.filter((y) => y._id === action.payload.parentId)[0].subtasks.push(action.payload.taskId);
      state.status = "idle";
    },
    dragTask: (state, action) => {
      const { colIndex, prevColIndex, taskIndex } = action.payload;
      const prevCol = state.entities.lists.find(
        (list) => list._id === prevColIndex
      );
      const task = prevCol.tasks.find((task) => task._id === taskIndex);

      prevCol.tasks = prevCol.tasks
        .map((prevTask) => {
          return prevTask._id !== task._id && prevTask;
        })
        .filter(Boolean);

      prevCol.tasks = prevCol.tasks
        ?.map((prevTask) => {
          if (task.subtasks?.includes(prevTask._id)) {
            state.entities.lists
              .find((list) => list._id === colIndex)
              .tasks.push(prevTask);
            return false;
          }
          return prevTask;
        })
        .filter(Boolean);

      state.entities.lists
        .find((list) => list._id === colIndex)
        .tasks.push(task);
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

export const { updateStatus, dragTask, addList, addTask } = boardSlice.actions;
export default boardSlice.reducer;

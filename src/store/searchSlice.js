import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import TaskService from "../api/BoardApi/task";

export const search = createAsyncThunk(
  "search/search",
  async (
    { workspaceIds, query, page = 1, limit = 10 },
    { getState, setState, rejectWithValue }
  ) => {
    console.log(setState);
    const token = getState().auth?.token?.token;
    const taskService = new TaskService();
    try {
      const response = await taskService.searchTasks(
        token,
        workspaceIds,
        query,
        page,
        limit
      );
      return {
        data: response.data,
        page: page,
        lastQuery: query,
      };
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return rejectWithValue(error.message);
    }
  }
);

const uniqueById = (array) => {
  const seen = new Set();
  return array.filter((item) => {
    const isDuplicate = seen.has(item._id);
    seen.add(item._id);
    return !isDuplicate;
  });
};

const searchSlice = createSlice({
  name: "searchResults",
  initialState: {
    entities: [],
    pagedEntities: [],
    status: "idle",
    error: null,
    page: 0,
    lastQuery: "",
  },
  reducers: {
    removeResults: (state, action) => {
      state.pagedEntities = [];
      state.entities = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(search.pending, (state) => {
        state.status = "loading";
      })
      .addCase(search.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entities = action.payload?.data || [];
        state.page = action.payload?.page || 1;

        if (state.lastQuery !== action.payload?.lastQuery) {
          state.pagedEntities = [];
          state.lastQuery = action.payload?.lastQuery;
        }

        state.pagedEntities.push(...(action.payload.data || []));

        state.pagedEntities = uniqueById(state.pagedEntities || []);
      })
      .addCase(search.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { removeResults } = searchSlice.actions;
export default searchSlice.reducer;

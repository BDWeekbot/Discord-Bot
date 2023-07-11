const { createSlice, configureStore } = require("@reduxjs/toolkit");
const { convertDate } = require("../functions/convertDate");

//STATUS
//
// date persists - expand state
// ping mongo on value of 20? and reset counter

const counterSlice = createSlice({
  name: "counter",
  initialState: {
    date: {},
  },
  reducers: {
    dates: (state) => {
      let nDate = new Date();
      state.date = convertDate(nDate);
    },
  },
});

const { incremented, decremented, dates } = counterSlice.actions;

const store = configureStore({
  reducer: counterSlice.reducer,
});

// Can still subscribe to the store
store.subscribe(() => console.log(store.getState()));

// // Still pass action objects to `dispatch`, but they're created for us
// store.dispatch(incremented())
// // {value: 1}
// store.dispatch(incremented())
// // {value: 2}
// store.dispatch(decremented())
// // {value: 1}

module.exports = { store, incremented, decremented, dates };

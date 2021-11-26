import { createStore } from 'redux'

const defaultState = {
    currentTime: {
        year: 2011,
        month: 5
    },
    yearMonthRange: null,
    selectedValue: "Discrete.Oxygen",
}

const reducer = (state , action) => {
  switch (action.type) {
    case "yearMonthRange/set":
      return {
            ...state,
            yearMonthRange: action.payload
       }
    case "currentTime/set":
        return {
            ...state,
            currentTime: action.payload
        }
    default:
      return state
  }
}

const createInitializedStore = () => {
    return createStore(reducer, defaultState)
} 

export default createInitializedStore;
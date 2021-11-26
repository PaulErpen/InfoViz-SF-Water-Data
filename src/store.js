import { createStore } from 'redux'

const defaultState = {
    currentTime: {
        year: 2011,
        month: 5
    },
    yearRange: null,
    selectedValue: "Discrete.Oxygen",
}

const reducer = (state , action) => {
  switch (action.type) {
    case "yearRange/set":
      return {
            ...state,
            yearRange: action.payload
       }
    default:
      return state
  }
}

const createInitializedStore = () => {
    return createStore(reducer, defaultState)
} 


export default createInitializedStore;
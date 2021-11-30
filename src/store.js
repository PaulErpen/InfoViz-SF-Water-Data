import { createStore } from 'redux'

const defaultState = {
    currentTime: {
        year: 2011,
        month: 5
    },
    yearMonthRange: null,
    selectedValue: "Optical.Backscatter",
    minDepth: 0,
    maxDepth: 4,
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
    case "minDepth/set":
        return {
            ...state,
            minDepth: action.payload
        }
    case "maxDepth/set":
        return {
            ...state,
            maxDepth: action.payload
        }
    default:
      return state
  }
}

const createInitializedStore = () => {
    return createStore(reducer, defaultState)
} 

export default createInitializedStore;
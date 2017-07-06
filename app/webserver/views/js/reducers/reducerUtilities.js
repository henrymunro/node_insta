// Reusable utility functions - from redux documentation

export const updateObject = (oldObject, newValues) => {
    // Encapsulate the idea of passing a new object as the first parameter
    // to Object.assign to ensure we correctly copy data instead of mutating
  return Object.assign({}, oldObject, newValues)
}

export const updateItemInArray = (array, itemId, updateItemCallback) => {
  const updatedItems = array.map(item => {
    if (item._id !== itemId) {
            // Since we only want to update one item, preserve all others as they are now
      return item
    }

        // Use the provided callback to create an updated item
    const updatedItem = updateItemCallback(item)
    return updatedItem
  })

  return updatedItems
}

export const removeElementFromArray = (array, itemId) => {
  return array.filter(element => element._id !== itemId)
}

export const addElementToArrayAtIndex = (array, index, element) => {
  const start = array.slice(0, index)
  const end = array.slice(index, array.length)
  return [...start, element, ...end]
}

export const moveElementInArray = (array, _id, newKey) => {
  const element = array.filter(element => element._id === _id)[0]
  const currentIndex = array.findIndex((val) => val._id === _id)
  const removed = removeElementFromArray(array, _id)
  // adjusting new index as element was removed
  const adjustedNewIndex = newKey <= currentIndex ? newKey : newKey - 1
  return addElementToArrayAtIndex(removed, adjustedNewIndex, element)
}

export const addOrUpdateItemInArray = (array, itemId, newItem) => {
  const exists = array.find(elm => elm._id === itemId)
  if (exists) {
    // if the element exists in the array update it
    return updateItemInArray(array, itemId, elmUPD => {
      return updateObject(elmUPD, newItem)
    })
  }
  // else add it
  return [...array, newItem]
}

export const updateOrAddToEditArray = (fullArray, editArray, elementChanges) => {
  // Checks to see if item already exists in edit array
  const exists = editArray.find(elm => elm._id === elementChanges._id)
// If item already exists pull out of the edit array and update
  let nextEdits
  if (exists) {
    nextEdits = addOrUpdateItemInArray(editArray, elementChanges._id, elementChanges)
  } else {
// else pull out the route element and apply changes
    const fullElement = fullArray.find(elm => elm._id === elementChanges._id)
    const editedElement = updateObject(fullElement, elementChanges)
    nextEdits = addOrUpdateItemInArray(editArray, elementChanges._id, editedElement)
  }
  return nextEdits
}

export const createReducer = (initialState, handlers) => {
  return function reducer (state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}

// Validate server API requests
export const processServerAPIResponse = (action) => {
  // handles add new entry and edit multple entries
  const { entry, success, errors, message } = action.payload.data || {}
  const errorMessage = (errors || {}).message
  const defaultErrorMessage = !success && 'AN ERROR OCCOURED'
  return {
    success,
    message,
    entry,
    errorMessage: errorMessage || (defaultErrorMessage || undefined),
    show: true
  }
}

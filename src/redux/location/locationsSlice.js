import { createSlice } from '@reduxjs/toolkit'
import { getAllLocationsAction } from './locationActions'

export const ELocationsReducer = createSlice({
  name: 'Elocation',
  initialState: {
    loading: false,
    getAllLocations: {
      locationsList: []
    }
  },
  reducers: {},
  extraReducers: (builder) => {
    const success = (state) => {
      state.loading = false
      state.error = null
    }

    const error = (state, action) => {
      state.loading = false
      state.error = action.payload
    }

    builder
      // Get All Locations
      .addCase(getAllLocationsAction.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllLocationsAction.fulfilled, (state, action) => {
        success(state)
        state.getAllLocations.locationsList = action.payload?.result
      })
      .addCase(getAllLocationsAction.rejected, (state, action) => {
        error(state, action)
        state.getAllLocations.locationsList = []
      })
  }
})

export default ELocationsReducer.reducer

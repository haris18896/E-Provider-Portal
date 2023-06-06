/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'
import { deleteLocationAction, getAllLocationAction, getLocationAction, registerLocationAction, updateLocationAction } from './locationAction'

export const LocationsReducer = createSlice({
  name: 'location',
  initialState: {
    loading: false,
    getAllLoading: false,
    deleteLoading:false,
    updateLoading: false,
    registerLocation: null,
    getAllLocations: {
      locationsList: [],
      count: 0,
      offset: 0,
      limit: 10
    },
    getLocation: null,
    updateLocation:null,
    error: null
  },
  reducers: {
    resetGetLocation: (state) => {
      state.getLocation = null
    }
  },
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
      // ** Register Location
      .addCase(registerLocationAction.pending, (state) => {
        state.loading = true
      })
      .addCase(registerLocationAction.fulfilled, (state, action) => {
        success(state)
        state.registerLocation = action.payload
      })
      .addCase(registerLocationAction.rejected, (state, action) => {
        error(state, action)
        state.registerLocation = null
      })

      // Get All Locations
      .addCase(getAllLocationAction.pending, (state) => {
        state.getAllLoading = true
      })
      .addCase(getAllLocationAction.fulfilled, (state, action) => {
        state.getAllLoading = false
        state.getAllLocations.locationsList = action.payload?.result
        state.getAllLocations.count = action.payload?.count
        state.getAllLocations.limit = action.payload?.limit
        state.getAllLocations.offset = action.payload?.offset
        state.error = null
      })
      .addCase(getAllLocationAction.rejected, (state, action) => {
        state.getAllLoading = false
        state.getAllLocations.locationsList = []
        state.error = action.payload
      })

      // Get Location
      .addCase(getLocationAction.pending, (state) => {
        state.pendingLoading = true
      })
      .addCase(getLocationAction.fulfilled, (state, action) => {
        state.pendingLoading = false
        state.getLocation = action.payload
        state.error = null
      })
      .addCase(getLocationAction.rejected, (state, action) => {
        state.pendingLoading = false
        state.getLocation = null
        state.error = action.payload
      })

      // Update Location
      .addCase(updateLocationAction.pending, (state) => {
        state.updateLoading = true
      })
      .addCase(updateLocationAction.fulfilled, (state, action) => {
        success(state)
        state.updateLoading = false
        state.updateLocation = action.payload
        state.error = null
      })
      .addCase(updateLocationAction.rejected, (state, action) => {
        state.updateLoading = false
        state.updateLocation = null
        state.error = action.payload
      })

      //** Delete Location */
      .addCase(deleteLocationAction.pending, (state) => {
        state.deleteLoading = true
      })
      .addCase(deleteLocationAction.fulfilled, (state, action) => {
        state.deleteLoading = false
        state.error = null
      })
      .addCase(deleteLocationAction.rejected, (state, action) => {
        state.deleteLoading = false
        state.error = action.payload
      })
  }
})

export const { resetGetLocation } = LocationsReducer.actions
export default LocationsReducer.reducer

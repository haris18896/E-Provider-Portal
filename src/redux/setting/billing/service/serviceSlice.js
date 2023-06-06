/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'
import {
  deleteServiceAction,
  getAllServiceAction,
  getServiceByIdAction,
  registerServiceAction,
  updateServiceAction
} from './serviceAction'

export const serviceReducer = createSlice({
  name: 'service',
  initialState: {
    getService: null,
    updateService: null,
    updateLoading: false,
    registerService: null,
    registerLoading: false,
    getServiceLoading: false,
    registerStripeCard: null,
    getAllServiceLoading: false,
    getAllServices: {
      serviceLists: [],
      offset: 0,
      limit: 10,
      total: 0
    },
    deleteLoading: false
  },
  reducers: {
    // resetGetLocation: (state) => {
    //   state.getLocation = null
    // }
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

      //** Get Provider Profile */
      .addCase(getAllServiceAction.pending, (state) => {
        state.getAllServiceLoading = true
      })
      .addCase(getAllServiceAction.fulfilled, (state, action) => {
        state.getAllServiceLoading = false
        state.getAllServices.serviceLists = action?.payload?.result
        state.getAllServices.offset = action.payload?.offset
        state.getAllServices.limit = action.payload?.limit
        state.getAllServices.total = action.payload?.count
        state.error = null
      })
      .addCase(getAllServiceAction.rejected, (state, action) => {
        state.getAllServiceLoading = false
        state.getAllServices = null
        state.error = action.payload
      })

      //** Register Service */
      .addCase(registerServiceAction.pending, (state) => {
        state.registerLoading = true
      })
      .addCase(registerServiceAction.fulfilled, (state, action) => {
        state.registerLoading = false
        state.registerService = action.payload
        state.error = null
      })
      .addCase(registerServiceAction.rejected, (state, action) => {
        state.registerLoading = false
        state.registerService = null
        state.error = action.payload
      })

      //** Get Service By Id */
      .addCase(getServiceByIdAction.pending, (state) => {
        state.getServiceLoading = true
      })
      .addCase(getServiceByIdAction.fulfilled, (state, action) => {
        state.getServiceLoading = false
        state.getService = action.payload
        state.error = null
      })
      .addCase(getServiceByIdAction.rejected, (state, action) => {
        state.getServiceLoading = false
        state.getService = null
        state.error = action.payload
      })

      //** Updaet Service */
      .addCase(updateServiceAction.pending, (state) => {
        state.updateLoading = true
      })
      .addCase(updateServiceAction.fulfilled, (state, action) => {
        state.updateLoading = false
        state.updateService = action.payload
        state.error = null
      })
      .addCase(updateServiceAction.rejected, (state, action) => {
        state.updateLoading = false
        state.updateService = null
        state.error = action.payload
      })

      //** Delete Service */
      .addCase(deleteServiceAction.pending, (state) => {
        state.deleteLoading = true
      })
      .addCase(deleteServiceAction.fulfilled, (state, action) => {
        state.deleteLoading = false
        state.error = null
      })
      .addCase(deleteServiceAction.rejected, (state, action) => {
        state.deleteLoading = false
        state.error = action.payload
      })
  }
})
// export const { resetGetLocation } = LocationsReducer.actions

export default serviceReducer.reducer

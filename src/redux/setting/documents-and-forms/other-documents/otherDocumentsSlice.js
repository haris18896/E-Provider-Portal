/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'
import {
  deleteOtherDocumentsAction,
  getAllOtherDocumentsAction,
  registerOtherDocumentsAction,
  updateOtherDocumentsAction
} from './otherDocumentsAction'

export const otherDocumentsReducer = createSlice({
  name: 'otherDocuments',
  initialState: {
    loading: false,
    getLoading: false,
    deleteLoading: false,
    updateLoading: false,
    getAllOtherDocuments: {
      data: [],
      offset: 0,
      limit: 10,
      total: 0
    },
    error: null,
    registerOtherDocuments: null
  },
  reducers: {},

  extraReducers: (builder) => {
    builder

      // ** register other documents
      .addCase(registerOtherDocumentsAction.pending, (state) => {
        state.loading = true
      })
      .addCase(registerOtherDocumentsAction.fulfilled, (state, action) => {
        state.loading = false
        state.registerOtherDocuments = action.payload
        state.error = null
      })
      .addCase(registerOtherDocumentsAction.rejected, (state, action) => {
        state.loading = false
        state.registerOtherDocuments = {}
        state.error = action.payload
      })

       // ** upate other documents
       .addCase(updateOtherDocumentsAction.pending, (state) => {
        state.updateLoading = true
      })
      .addCase(updateOtherDocumentsAction.fulfilled, (state, action) => {
        state.updateLoading = false
        state.updateOtherDocuments = action.payload
        state.error = null
      })
      .addCase(updateOtherDocumentsAction.rejected, (state, action) => {
        state.updateLoading = false
        state.updateOtherDocuments = {}
        state.error = action.payload
      })

      // ** Get all other documents
      .addCase(getAllOtherDocumentsAction.pending, (state) => {
        state.getLoading = true
      })
      .addCase(getAllOtherDocumentsAction.fulfilled, (state, action) => {
        state.getLoading = false
        state.getAllOtherDocuments.data = action.payload?.result
        state.getAllOtherDocuments.offset = action.payload?.offset
        state.getAllOtherDocuments.limit = action.payload?.limit
        state.getAllOtherDocuments.total = action.payload?.count
        state.error = null
      })
      .addCase(getAllOtherDocumentsAction.rejected, (state, action) => {
        state.getLoading = false
        state.getAllOtherDocuments = {
          data: [],
          offset: 0,
          limit: 10,
          total: 0
        }
        state.error = action.payload
      })

       // ** register other documents
       .addCase(deleteOtherDocumentsAction.pending, (state) => {
        state.deleteLoading = true
      })
      .addCase(deleteOtherDocumentsAction.fulfilled, (state, action) => {
        state.deleteLoading = false
        state.error = null
      })
      .addCase(deleteOtherDocumentsAction.rejected, (state, action) => {
        state.deleteLoading = false
        state.error = action.payload
      })

  }
})

export default otherDocumentsReducer.reducer

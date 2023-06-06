/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'
import {
  getBillingInfoAction,
  registerBillingInfoAction,
  updateBillingInfoAction
} from './billingInfoAction'

export const billingInfoReducer = createSlice({
  name: 'billingInfo',
  initialState: {
    loading: false,
    getLoading: false,
    getBillingInfo: null,
    updateLoading: false,
    updateBillingInfo: null,
    registerBillingInfo: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      //** Register Billing Info */
      .addCase(registerBillingInfoAction.pending, (state) => {
        state.loading = true
      })
      .addCase(registerBillingInfoAction.fulfilled, (state, action) => {
        state.loading = false
        state.registerBillingInfo = action.payload
        state.error = null
      })
      .addCase(registerBillingInfoAction.rejected, (state, action) => {
        state.loading = false
        state.registerBillingInfo = null
        state.error = action.payload
      })

      //** Get Billing Info */
      .addCase(getBillingInfoAction.pending, (state) => {
        state.getLoading = true
      })
      .addCase(getBillingInfoAction.fulfilled, (state, action) => {
        state.getLoading = false
        state.getBillingInfo = action.payload
        state.error = null
      })
      .addCase(getBillingInfoAction.rejected, (state, action) => {
        state.getLoading = false
        state.getBillingInfo = null
        state.error = action.payload
      })

      //** update Billing Info */
      .addCase(updateBillingInfoAction.pending, (state) => {
        state.updateLoading = true
      })
      .addCase(updateBillingInfoAction.fulfilled, (state, action) => {
        state.updateLoading = false
        state.updateBillingInfo = action.payload
        state.error = null
      })
      .addCase(updateBillingInfoAction.rejected, (state, action) => {
        state.updateLoading = false
        state.updateBillingInfo = null
        state.error = action.payload
      })
  }
})

export default billingInfoReducer.reducer

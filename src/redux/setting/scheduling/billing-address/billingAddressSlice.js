/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'
import {
  deleteBillingAddressAction,
  getAllBillingAddressAction,
  getBillingAddressAction,
  registerBillingAddressAction,
  updateBillingAddressAction
} from './billingAddressAction'

export const BillingAddressReducer = createSlice({
  name: 'billingAddress',
  initialState: {
    loading: false,
    getAllLoading: false,
    deleteLoading: false,
    pendingLoading: false,
    updateLoading: false,
    registerBillingAddress: null,
    getAllBillingAddress: {
      billingAddressList: [],
      count: 0,
      offset: 0,
      limit: 10
    },
    getBillingAddress: null,
    updateBillingAddress: null,
    error: null
  },
  reducers: {
    resetGetBillingAddress: (state) => {
      state.getBillingAddress = null
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
      // ** Register Billing Address
      .addCase(registerBillingAddressAction.pending, (state) => {
        state.loading = true
      })
      .addCase(registerBillingAddressAction.fulfilled, (state, action) => {
        success(state)
        state.registerBillingAddress = action.payload
      })
      .addCase(registerBillingAddressAction.rejected, (state, action) => {
        error(state, action)
        state.registerBillingAddress = null
      })

      //**  Get All Billing Address
      .addCase(getAllBillingAddressAction.pending, (state) => {
        state.getAllLoading = true
      })
      .addCase(getAllBillingAddressAction.fulfilled, (state, action) => {
        state.getAllLoading = false
        state.getAllBillingAddress.billingAddressList = action.payload?.result
        state.getAllBillingAddress.count = action.payload?.count
        state.getAllBillingAddress.limit = action.payload?.limit
        state.getAllBillingAddress.offset = action.payload?.offset
        state.error = null
      })
      .addCase(getAllBillingAddressAction.rejected, (state, action) => {
        state.getAllLoading = false
        state.getAllBillingAddress.billingAddressList = []
        state.error = action.payload
      })

      //**  Get Billing Address
      .addCase(getBillingAddressAction.pending, (state) => {
        state.pendingLoading = true
      })
      .addCase(getBillingAddressAction.fulfilled, (state, action) => {
        state.pendingLoading = false
        state.getBillingAddress = action.payload
        state.error = null
      })
      .addCase(getBillingAddressAction.rejected, (state, action) => {
        state.pendingLoading = false
        state.getBillingAddress = null
        state.error = action.payload
      })

      //**  Update Billing Address
      .addCase(updateBillingAddressAction.pending, (state) => {
        state.updateLoading = true
      })
      .addCase(updateBillingAddressAction.fulfilled, (state, action) => {
        success(state)
        state.updateLoading = false
        state.updateBillingAddress = action.payload
        state.error = null
      })
      .addCase(updateBillingAddressAction.rejected, (state, action) => {
        state.updateLoading = false
        state.updateBillingAddress = null
        state.error = action.payload
      })

      //** Delete Billing Address */
      .addCase(deleteBillingAddressAction.pending, (state) => {
        state.deleteLoading = true
      })
      .addCase(deleteBillingAddressAction.fulfilled, (state, action) => {
        state.deleteLoading = false
        state.error = null
      })
      .addCase(deleteBillingAddressAction.rejected, (state, action) => {
        state.deleteLoading = false
        state.error = action.payload
      })
  }
})

export const { resetGetLocation } = BillingAddressReducer.actions
export default BillingAddressReducer.reducer

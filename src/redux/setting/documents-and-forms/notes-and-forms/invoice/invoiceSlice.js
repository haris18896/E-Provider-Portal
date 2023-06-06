import { createSlice } from '@reduxjs/toolkit'
import { getInvoiceAction, getSuperBillsAction, updateInvoiceAction, updateSuperBillsAction } from './invoiceAction'

// import {
//   getAllAppointmentsAction,
//   getAppointmentByIdAction,
//   updateAppointmentAction,
//   ValidateRoomAction
// } from './appointmentsAction'

export const InvoiceReducer = createSlice({
  name: 'invoice',
  initialState: {
    loading: false,
    error: null,
    getInvoice: null,
    getSuperbill: null,
    updateSuperbill: null,
    updateInvoice: null,
    superbillPending: false,
    updateInvoicePending: false,
    updateSuperbillPending: false
  },
  reducers: {
    resetGetAppointmentById: (state) => {
      state.getAppointment = {}
    }
  },

  extraReducers: (builder) => {
    builder

      // ** Get invoice by id
      .addCase(getInvoiceAction.pending, (state) => {
        state.loading = true
      })
      .addCase(getInvoiceAction.fulfilled, (state, action) => {
        state.loading = false
        state.getInvoice = action.payload
        state.error = null
      })
      .addCase(getInvoiceAction.rejected, (state, action) => {
        state.loading = false
        state.getInvoice = {}
        state.error = action.payload
      })

      // ** update invoice by id
      .addCase(updateInvoiceAction.pending, (state) => {
        state.updateInvoicePending = true
      })
      .addCase(updateInvoiceAction.fulfilled, (state, action) => {
        state.updateInvoicePending = false
        state.updateInvoice = action.payload
        state.error = null
      })
      .addCase(updateInvoiceAction.rejected, (state, action) => {
        state.updateInvoicePending = false
        state.updateInvoice = {}
        state.error = action.payload
      })

       // ** Get superBills by id
       .addCase(getSuperBillsAction.pending, (state) => {
        state.superbillPending = true
      })
      .addCase(getSuperBillsAction.fulfilled, (state, action) => {
        state.superbillPending = false
        state.getSuperbill = action.payload
        state.error = null
      })
      .addCase(getSuperBillsAction.rejected, (state, action) => {
        state.superbillPending = false
        state.getSuperbill = {}
        state.error = action.payload
      })

      // ** update super bills by id
      .addCase(updateSuperBillsAction.pending, (state) => {
        state.updateSuperbillPending = true
      })
      .addCase(updateSuperBillsAction.fulfilled, (state, action) => {
        state.updateSuperbillPending = false
        state.updateSuperbill = action.payload
        state.error = null
      })
      .addCase(updateSuperBillsAction.rejected, (state, action) => {
        state.updateSuperbillPending = false
        state.updateSuperbill = {}
        state.error = action.payload
      })

  }
})

export default InvoiceReducer.reducer

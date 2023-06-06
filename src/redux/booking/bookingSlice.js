import { createSlice } from '@reduxjs/toolkit'

import {
  getBookingInvoice,
  ValidateRoomAction,
  getAllBillingAction,
  updateBookingAction,
  getBookingByIdAction,
  getAllBookingsAction,
  getMonthlyInvoiceAction,
  updateAppointmentAction,
  updateAppointmentWithBookingAction
} from './bookingAction'

export const BookingsReducer = createSlice({
  name: 'booking',
  initialState: {
    success: false,
    updatePending: false,
    bookingPending: false,
    validRoomsPending: false,
    bookingListPending: false,
    appointmentPending: false,
    bookingInvoicePending: false,
    getAllBookings: {
      data: [],
      offset: 0,
      limit: 10,
      total: 0
    },
    bookingInvoice: {},
    getBooking: null,
    updateBooking: {},
    getAllBillings: {
      billingsList: [],
      offset: 0,
      limit: 10,
      total: 0
    },
    validRoomsData: {
      rooms: [],
      offset: 0,
      limit: 100,
      total: 0
    },
    getMonthInvoice: null,
    updateAppointmentWithBooking: null,
    error: null
  },
  reducers: {
    resetGetAllBookings: (state) => {
      state.getAllBookings = {
        data: [],
        offset: 0,
        limit: 10,
        total: 0
      }
    },
    resetGetBooking: (state) => {
      state.getBooking = {}
    },
    resetUpdateBooking: (state) => {
      state.updateBooking = {}
    },
    resetGetAllBillings: (state) => {
      state.getAllBillings = {
        billingsList: [],
        offset: 0,
        limit: 10,
        total: 0
      }
    },
    resetValidateRoom: (state) => {
      state.validRoomsData = {
        rooms: [],
        offset: 0,
        limit: 100,
        total: 0
      }
    },
    resetGetMonthlyInvoice: (state) => {
      state.getMonthInvoice = {}
    },
    resetAppointmentWithBooking: (state) => {
      state.updateAppointmentWithBooking = {}
    },
    resetBookingInvoice: (state) => {
      state.bookingInvoice = {}
    }
  },
  extraReducers: (builder) => {
    builder
      // ** Get all bookings
      .addCase(getAllBookingsAction.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllBookingsAction.fulfilled, (state, action) => {
        state.loading = false
        state.getAllBookings.data = action.payload?.result
        state.getAllBookings.offset = action.payload?.offset
        state.getAllBookings.limit = action.payload?.limit
        state.getAllBookings.total = action.payload?.count
      })
      .addCase(getAllBookingsAction.rejected, (state, action) => {
        state.loading = false
        state.getAllBookings = {
          data: [],
          offset: 0,
          limit: 10,
          total: 0
        }
        state.error = action.payload
      })

      // ** Get booking by id
      .addCase(getBookingByIdAction.pending, (state) => {
        state.bookingPending = true
      })
      .addCase(getBookingByIdAction.fulfilled, (state, action) => {
        state.bookingPending = false
        state.getBooking = action.payload
      })
      .addCase(getBookingByIdAction.rejected, (state, action) => {
        state.bookingPending = false
        state.getBooking = {}
        state.error = action.payload
      })

      // Get all billings
      .addCase(getAllBillingAction.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllBillingAction.fulfilled, (state, action) => {
        state.loading = false
        state.getAllBillings.billingsList = action.payload?.result
        state.getAllBillings.offset = action.payload?.offset
        state.getAllBillings.limit = action.payload?.limit
        state.getAllBillings.total = action.payload?.count
      })
      .addCase(getAllBillingAction.rejected, (state, action) => {
        state.loading = false
        state.getAllBillings = {
          billingsList: [],
          offset: 0,
          limit: 10,
          total: 0
        }
        state.error = action.payload
      })
      // Get  monthly invoice
      .addCase(getMonthlyInvoiceAction.pending, (state) => {
        state.loading = true
      })
      .addCase(getMonthlyInvoiceAction.fulfilled, (state, action) => {
        state.loading = false
        state.getMonthInvoice = action.payload
      })
      .addCase(getMonthlyInvoiceAction.rejected, (state, action) => {
        state.loading = false
        state.getMonthInvoice = null
        state.error = action.payload
      })

      // ** Update booking
      .addCase(updateBookingAction.pending, (state) => {
        state.updatePending = true
        state.success = false
      })
      .addCase(updateBookingAction.fulfilled, (state, action) => {
        state.updatePending = false
        state.success = true
        state.updateBooking = action.payload
      })
      .addCase(updateBookingAction.rejected, (state, action) => {
        state.updatePending = false
        state.updateBooking = {}
        state.success = false
        state.error = action.payload
      })

      //** Update appointment with booking action */
      .addCase(updateAppointmentAction.pending, (state) => {
        state.updatePending = true
      })
      .addCase(updateAppointmentAction.fulfilled, (state, action) => {
        state.updatePending = false
        state.updateAppointmentWithBooking = action.payload
      })
      .addCase(updateAppointmentAction.rejected, (state, action) => {
        state.updatePending = false
        state.updateAppointmentWithBooking = {}
        state.error = action.payload
      })

      //**  get Valid Room  */
      .addCase(ValidateRoomAction.pending, (state) => {
        state.validRoomsPending = true
      })
      .addCase(ValidateRoomAction.fulfilled, (state, action) => {
        state.validRoomsPending = false
        state.validRoomsData.rooms = action.payload?.result
        state.validRoomsData.offset = action.payload?.offset
        state.validRoomsData.limit = action.payload?.limit
        state.validRoomsData.total = action.payload?.count
      })
      .addCase(ValidateRoomAction.rejected, (state, action) => {
        state.validRoomsPending = false
        state.validRoomsData = {
          offset: 0,
          limit: 100,
          total: 0,
          rooms: []
        }
        state.error = action.payload
      })

      // ** Booking Invoice
      .addCase(getBookingInvoice.pending, (state) => {
        state.bookingInvoicePending = true
      })
      .addCase(getBookingInvoice.fulfilled, (state, action) => {
        state.bookingInvoicePending = false
        state.bookingInvoice = action.payload
      })
      .addCase(getBookingInvoice.rejected, (state, action) => {
        state.bookingInvoicePending = false
        state.error = action.payload
      })

      // ** Update Booking & Appointment
      .addCase(updateAppointmentWithBookingAction.pending, (state) => {
        state.appointmentPending = true
      })
      .addCase(updateAppointmentWithBookingAction.fulfilled, (state) => {
        state.appointmentPending = false
      })
      .addCase(updateAppointmentWithBookingAction.rejected, (state, action) => {
        state.appointmentPending = false
        state.error = action.payload
      })
  }
})

export const {
  resetGetBooking,
  resetValidateRoom,
  resetUpdateBooking,
  resetGetAllBookings,
  resetBookingInvoice,
  resetGetAllBillings,
  resetGetMonthlyInvoice,
  resetAppointmentWithBooking
} = BookingsReducer.actions

export default BookingsReducer.reducer

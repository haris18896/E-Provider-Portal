/* eslint-disable no-unused-vars */
import useJwt from '@src/auth/jwt/useJwt'
import { createAsyncThunk } from '@reduxjs/toolkit'

import toast from 'react-hot-toast'
import { Check, X } from 'react-feather'
import { ToastContent } from '@src/components/toast'
import { updateCalendarBookingAction } from '../calendar/calendarActions'

// ** Field Errors
const fieldErrors = (err) => {
  const errors = err?.response?.data
  if (errors) {
    Object.keys(errors).map((key) => {
      toast((t) => (
        <ToastContent
          t={t}
          name="Error While Updating Booking"
          icon={<X size={14} />}
          color="danger"
          msg={
            errors?.msg ||
            errors?.detail ||
            errors[key] ||
            errors?.non_field_errors?.[0]
          }
        />
      ))
    })
  }
}

//** GET ALL Bookings */
export const getAllBookingsAction = createAsyncThunk(
  'booking/getAllBookings',
  async (
    { offset, limit, startDate, endDate, status, location, user },
    { rejectWithValue }
  ) => {
    try {
      const response = await useJwt.getAllBookings({
        offset,
        limit,
        startDate,
        endDate,
        status,
        location,
        user
      })

      return response.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Bookings'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

//** Get Booking By Id */
export const getBookingByIdAction = createAsyncThunk(
  'booking/getBookingById',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await useJwt.getBookingById(id)
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

//**   Get All Billing Invoice */

export const getAllBillingAction = createAsyncThunk(
  'booking/getAllBillings',
  async ({ offset, limit }, { rejectWithValue }) => {
    try {
      const response = await useJwt.getAllBillings({
        offset,
        limit
      })
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Billings'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

//**   Get Billing Invoice */
export const getMonthlyInvoiceAction = createAsyncThunk(
  'booking/getMonthlyInvoice',
  async (id, { rejectWithValue }) => {
    try {
      const response = await useJwt.getMonthlyInvoice(id)
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Billings'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

//**  Get Valid Rooms */
export const ValidateRoomAction = createAsyncThunk(
  'booking/ValidateRoom',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await useJwt.validateRoom(id, data)
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching rooms'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.non_field_errors}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

//** Get Booking By Id */
export const getUpdateBookingByIdAction = createAsyncThunk(
  'booking/getBookingById',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await useJwt.getUpdateBookingById(id)
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const getBookingInvoice = createAsyncThunk(
  'booking/booking-invoice',
  async (id, { rejectWithValue }) => {
    try {
      const res = await useJwt.getBookingInvoice(id)

      return res?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const updateBookingAction = createAsyncThunk(
  'booking/update-Booking',
  async (
    { id, data, startDate, endDate, callback },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await useJwt.updateCalendarBooking(id, data)

      if (response?.data) {
        dispatch(
          getAllBookingsAction({ offset: 0, limit: 10, startDate, endDate })
        )
      }
      callback()

      toast((t) => (
        <ToastContent
          t={t}
          name={'Booking Updated Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))

      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const updateAppointmentAction = createAsyncThunk(
  'booking/update-Appointment',
  async (
    { id, data, startDate, endDate, callback },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await useJwt.updateCalendarAppointment(id, data)
      if (response?.data) {
        dispatch(
          getAllBookingsAction({ offset: 0, limit: 10, startDate, endDate })
        )
      }
      callback()
      toast((t) => (
        <ToastContent
          t={t}
          name={'Appointment Updated Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))

      return response?.data
    } catch (err) {
      fieldErrors(err)

      return rejectWithValue(err?.response?.data)
    }
  }
)

export const updateAppointmentWithBookingAction = createAsyncThunk(
  'booking/update-Appointment-With-Booking',
  async (
    {
      booking_id,
      appointment_id,
      appointmentData,
      bookingData,
      startDate,
      endDate,
      callback
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const res = await useJwt.updateCalendarAppointment(
        appointment_id,
        appointmentData
      )

      if (res?.data) {
        dispatch(
          updateBookingAction({
            id: booking_id,
            data: bookingData,
            startDate,
            endDate,
            callback
          })
        )
      }
      return res?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Handling Pagination
export const handlePageChange = createAsyncThunk(
  'booking/handlePageChange',
  async (
    { offset, limit, invoice, startDate, endDate, status, location, user },
    { dispatch }
  ) => {
    if (invoice === undefined) {
      dispatch(
        getAllBookingsAction({
          offset,
          limit,
          startDate,
          endDate,
          status,
          location,
          user
        })
      )
    }
    if (invoice) {
      dispatch(
        getAllBookingsAction({
          offset,
          limit
        })
      )
    }
  }
)

// ** Handling Limit
export const handleLimitChange = createAsyncThunk(
  'booking/handleLimitChange',
  async (
    { oldLimit, newLimit, invoice, startDate, endDate, status, location, user },
    { dispatch }
  ) => {
    if (newLimit !== oldLimit && invoice === undefined) {
      dispatch(
        getAllBookingsAction({
          offset: 0,
          limit: newLimit,
          startDate,
          endDate,
          status,
          location,
          user
        })
      )
    }
    if (newLimit !== oldLimit && invoice) {
      dispatch(
        getAllBillingAction({
          offset: 0,
          limit: newLimit
        })
      )
    }
  }
)

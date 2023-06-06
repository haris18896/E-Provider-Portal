/* eslint-disable no-unused-vars */
import useJwt from '@src/auth/jwt/useJwt'
import { createAsyncThunk } from '@reduxjs/toolkit'

import toast from 'react-hot-toast'
import { X, Check } from 'react-feather'
import { ToastContent } from '@src/components/toast'

// ** Field Errors
const fieldErrors = (err) => {
  const errors = err?.response?.data
  if (errors) {
    Object.keys(errors).map((key) => {
      toast((t) => (
        <ToastContent
          t={t}
          name="Error in Booking"
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

export const getAllCalendarAppointmentsAction = createAsyncThunk(
  'calendar/getAllBookings',
  async (
    { offset, limit, startDate, endDate, callback },
    { rejectWithValue }
  ) => {
    try {
      const response = await useJwt.getAllCalendarAppointments(
        offset,
        limit,
        startDate,
        endDate
      )

      if (response?.data?.result.length > 0) {
        callback(response?.data?.result)
      }

      return response.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching appointments'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const getCalendarEtheraLocationsAction = createAsyncThunk(
  'calendar/ethera-locations',
  async ({ offset, limit }, { rejectWithValue }) => {
    try {
      const res = await useJwt.getEtheraLocations(offset, limit)

      return res?.data?.result
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Ethera Locations'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.non_field_errors}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const getCalendarOtherLocationsAction = createAsyncThunk(
  'calendar/other-locations',
  async ({ id, offset, limit }, { rejectWithValue }) => {
    try {
      const res = await useJwt.getProvidersLocations(id, offset, limit)

      return res?.data?.result
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Providers Locations'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.non_field_errors}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const getCalendarAppointmentByIdAction = createAsyncThunk(
  'calendar/getCalendarAppointmentById',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await useJwt.getCalendarAppointmentById(id)
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const getCalendarValidRoomsAction = createAsyncThunk(
  'calendar/validateCalendarRooms',
  async ({ id, data, callback }, { rejectWithValue }) => {
    try {
      const res = await useJwt.validateCalendarRooms(id, data)
      callback(res?.data?.result)

      return res?.data?.result
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching rooms'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.non_field_errors[0]}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const calendarAddNewClientAction = createAsyncThunk(
  'calendar/add-new-client',
  async ({ data, callback }, { rejectWithValue }) => {
    try {
      const res = await useJwt.registerClient(data)

      if (res?.data) {
        toast((t) => (
          <ToastContent
            t={t}
            name={'Register Client Successfully'}
            icon={<Check size={14} />}
            color="success"
            msg={res?.data?.message}
          />
        ))
        callback()
      }

      return res?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const getCalendarClientsAction = createAsyncThunk(
  'calendar/get-calendar-clients',
  async ({ offset, limit, search }) => {
    try {
      const res = await useJwt.getAllCalendarClients(offset, limit, search)

      return res?.data?.result
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Clients'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const getCalendarClientServicesAction = createAsyncThunk(
  'calendar/get-calendar-client-services',
  async ({ offset, limit, search, clients }, { rejectWithValue }) => {
    try {
      const res = await useJwt.getClientServices(offset, limit, clients, search)
      return res?.data?.result
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Client Services'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const deleteCalendarBookingAction = createAsyncThunk(
  'calendar/deleteCalendarBooking',
  async ({ id, callback }, { rejectWithValue }) => {
    try {
      const response = await useJwt.deleteCalendarBooking(id)
      callback()
      toast((t) => (
        <ToastContent
          t={t}
          name="Booking has been deleted"
          icon={<Check size={14} />}
          color="success"
        />
      ))
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const deleteBookingFromAppointmentAction = createAsyncThunk(
  'calendar/deleteBookingFromAppointment',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await useJwt.deleteCalendarBooking(id)
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const deleteCalendarAppointmentAction = createAsyncThunk(
  'calendar/deleteCalendarAppointment',
  async ({ id, callback }, { rejectWithValue }) => {
    try {
      const response = await useJwt.deleteCalendarAppointment(id)
      callback()
      toast((t) => (
        <ToastContent
          t={t}
          name="Appointment has been deleted"
          icon={<Check size={14} />}
          color="success"
        />
      ))

      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const addCalendarAppointmentAction = createAsyncThunk(
  'calendar/add-appointment',
  async ({ data, callback }, { rejectWithValue }) => {
    try {
      const res = await useJwt.addAppointment(data)
      callback()
      return res?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const addCalendarAppointmentWithBookingAction = createAsyncThunk(
  'calendar/add-appointment-with-booking',
  async ({ data, bookingId, callback }, { dispatch, rejectWithValue }) => {
    try {
      const res = await useJwt.addAppointmentWithBooking(data, bookingId)
      callback()
      return res?.data
    } catch (err) {
      if (bookingId) {
        dispatch(
          deleteBookingFromAppointmentAction({
            id: bookingId
          })
        )
      }
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const addCalendarBookingAction = createAsyncThunk(
  'calendar/add-booking',
  async ({ data, callback }, { dispatch, rejectWithValue }) => {
    try {
      const res = await useJwt.addBooking(data?.booking)
      if (res?.data?.id) {
        dispatch(
          addCalendarAppointmentWithBookingAction({
            data: data?.appointment,
            bookingId: res?.data?.id,
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

export const updateCalendarAppointmentAction = createAsyncThunk(
  'calendar/updateCalendarAppointment',
  async ({ id, data, callback }, { rejectWithValue }) => {
    try {
      const response = await useJwt.updateCalendarAppointment(id, data)
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

export const updateCalendarBookingAction = createAsyncThunk(
  'calendar/updateCalendarBooking',
  async ({ id, data, callback }, { rejectWithValue }) => {
    try {
      const response = await useJwt.updateCalendarBooking(id, data)
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
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const updateCalendarBookingWithAppointmentAction = createAsyncThunk(
    'calendar/update-calendar-booking-with-appointment',
    async ({ booking_id, appointment_id, appointmentData, bookingData, callback }, { dispatch, rejectWithValue }) => {
        try {
            const response = await useJwt.updateCalendarBooking(booking_id, bookingData)

            if (response?.data) {
                dispatch(updateCalendarAppointmentAction({
                    id: appointment_id,
                    data: appointmentData,
                    callback
                }))
            }
        } catch (err) {
            fieldErrors(err)
            return rejectWithValue(err?.response?.data)
        }
    }
)

// export const updateCalendarAppointmentWithBookingAction = createAsyncThunk(
//   'calendar/updateCalendarAppointmentWithBooking',
//   async (
//     { booking_id, appointment_id, appointmentData, bookingData, callback },
//     { dispatch, rejectWithValue }
//   ) => {
//     try {
//       const res = await useJwt.updateCalendarAppointment(
//         appointment_id,
//         appointmentData
//       )
//
//       if (res?.data) {
//         dispatch(
//           updateCalendarBookingAction({
//             id: booking_id,
//             data: bookingData,
//             callback
//           })
//         )
//       }
//       return res?.data
//     } catch (err) {
//       fieldErrors(err)
//       return rejectWithValue(err?.response?.data)
//     }
//   }
// )

// export const updateCalendarAppointmentWithBookingAction = createAsyncThunk(
//   'calendar/updateCalendarAppointmentWithBooking',
//   async (
//     { booking_id, appointment_id, appointmentData, bookingData, callback },
//     { dispatch, rejectWithValue }
//   ) => {
//     try {

//       const response = await useJwt.updateCalendarBooking({
//         id: booking_id,
//         data: bookingData
//       })

//       if (response?.data) {
//         dispatch(
//           updateCalendarAppointmentAction({
//             id: appointment_id,
//             data: appointmentData,
//             callback
//           })
//         )
//       }
//       return res?.data
//     } catch (err) {
//       fieldErrors(err)
//       return rejectWithValue(err?.response?.data)
//     }
//   }
// )

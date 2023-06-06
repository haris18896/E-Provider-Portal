/* eslint-disable no-unused-vars */
import useJwt from '@src/auth/jwt/useJwt'
import { createAsyncThunk } from '@reduxjs/toolkit'

import toast from 'react-hot-toast'
import { Check, X } from 'react-feather'
import { ToastContent } from '@src/components/toast'

// ** Field Errors
const fieldErrors = (err) => {
  const errors = err?.response?.data
  if (errors) {
    Object.keys(errors).map((key) => {
      toast((t) => (
        <ToastContent
          t={t}
          name="Error While Updating Appointments"
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

//** get all appointments */
export const getAllAppointmentsAction = createAsyncThunk(
  'appointments/getAllAppointments',
  async (
    { offset, limit, startDate, endDate, status, location, user },
    { rejectWithValue }
  ) => {
    try {
      const response = await useJwt.getAllAppointments({
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
//** Get appointment By Id */
export const getAppointmentByIdAction = createAsyncThunk(
  'appointments/getAppointmentById',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await useJwt.getAppointmentById(id)
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

//** Update Appointment */
export const updateAppointmentAction = createAsyncThunk(
  'appointments/updateAppointmentAction',
  async (
    { id, data, startDate, endDate, callback },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await useJwt.updateAppointment(id, data)

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
      if (response?.data) {
        dispatch(
          getAllAppointmentsAction({ offset: 0, limit: 10, startDate, endDate })
        )
      }

      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)
// ** Handling Pagination
export const handlePageChange = createAsyncThunk(
  'appointments/handlePageChange',
  async (
    { offset, limit, startDate, endDate, status, location, user },
    { dispatch }
  ) => {
    dispatch(
      getAllAppointmentsAction({
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
)

// ** Handling Limit
export const handleLimitChange = createAsyncThunk(
  'appointments/handleLimitChange',
  async (
    { oldLimit, newLimit, startDate, endDate, status, location, user },
    { dispatch }
  ) => {
    if (newLimit !== oldLimit) {
      dispatch(
        getAllAppointmentsAction({
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
  }
)

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
          name="Error While Updating Invoice"
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

//** Get provider calendar  */
export const getProviderCalendarAction = createAsyncThunk(
  'providerCalendar/getProviderCalendar',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await useJwt.getProviderCalendar()
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

//** update provider calendar   */
export const updateProviderCalendarAction = createAsyncThunk(
  'providerCalendar/updateProviderCalendar',
  async ({data}, { rejectWithValue, dispatch }) => {
    try {
      const response = await useJwt.updateProviderCalendar(data)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Calendar Setting Updated Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      dispatch(getProviderCalendarAction())
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)
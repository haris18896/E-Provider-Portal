/* eslint-disable no-unused-vars */
import useJwt from '@src/auth/jwt/useJwt'
import { createAsyncThunk } from '@reduxjs/toolkit'

// ** components
import toast from 'react-hot-toast'
import { Check, X } from 'react-feather'
import { ToastContent } from '@src/components/toast'

// Field Errors
const fieldErrors = (err) => {
  const errors = err?.response?.data
  if (errors) {
    Object.keys(errors).map((key) => {
      toast((t) => (
        <ToastContent
          t={t}
          name={key}
          icon={<X size={14} />}
          color="danger"
          msg={
            errors?.detail || errors[key][0] || errors?.non_field_errors?.[0]
          }
        />
      ))
    })
  }
}
// ** Get All Locations List
export const getAllLocationsAction = createAsyncThunk(
  'Elocation/getAllLocations',
  async (payload, { rejectWithValue }) => {
    try {
      // const { callBack } = payload
      const response = await useJwt.getAllLocations()

      // callBack()
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching locations'}
          icon={<Check size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)
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

//** Register Billing Info */
export const registerBillingInfoAction = createAsyncThunk(
  'billingInfo/registerBillingInfo',
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await useJwt.registerBillingInfo(data)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Register Billing Information Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.msg}
        />
      ))
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Register Billing Information'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.provider[0]}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

//** get Billing Info */
export const getBillingInfoAction = createAsyncThunk(
  'billingInfo/getBillingInfo',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await useJwt.getBillingInfoAction(id)

      return response?.data
    } catch (err) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

//** update Billing Info */
export const updateBillingInfoAction = createAsyncThunk(
  'billingInfo/updateBillingInfo',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.updateBillingInfoAction(id, data)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Billing Information Updated Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.msg}
        />
      ))
      dispatch(getBillingInfoAction({ id }))
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Register Billing Information'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.provider[0]}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

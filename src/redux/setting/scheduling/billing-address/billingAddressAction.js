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

// ** Get All Billing Address
export const getAllBillingAddressAction = createAsyncThunk(
  'billingAddress/getAllBillingAddress',
  async ({ offset, limit, id }, { rejectWithValue }) => {
    try {
      const response = await useJwt.getAllBillingAddress(offset, limit, id)
      return response?.data
    } catch (err) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Get Single Billing Address
export const getBillingAddressAction = createAsyncThunk(
  'billingAddress/getBillingAddress',
  async ({ providerId, id }, { rejectWithValue }) => {
    try {
      const response = await useJwt.getBillingAddress(providerId, id)
      return response?.data
    } catch (err) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Update Billing Address
export const updateBillingAddressAction = createAsyncThunk(
  'billingAddress/updateBillingAddress',
  async (
    { limit, offset, providerId, id, data },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await useJwt.updateBillingAddress(providerId, id, data)
      if (response?.data) {
        toast((t) => (
          <ToastContent
            t={t}
            name={'Update billing Address Successfully'}
            icon={<Check size={14} />}
            color="success"
            msg={response?.data?.message}
          />
        ))
      }
      dispatch(getAllBillingAddressAction({ offset, limit, id: providerId }))
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Add Billing Address
export const registerBillingAddressAction = createAsyncThunk(
  'billingAddress/registerBillingAddress',
  async ({ id, data, callback }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.registerBillingAddress(id, data)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Register Address Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.msg}
        />
      ))
      callback()
      dispatch(getAllBillingAddressAction({ offset: 0, limit: 5, id }))
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Delete Billing Address
export const deleteBillingAddressAction = createAsyncThunk(
  'billingAddress/deleteBillingAddress',
  async (
    { limit, id, providerId, callback },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await useJwt.deleteBillingAddress(providerId, id)

      toast((t) => (
        <ToastContent
          t={t}
          name="Billing Address Deleted Successfully"
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      callback()
      dispatch(getAllBillingAddressAction({ offset: 0, limit, id: providerId }))
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Handling Pagination
export const handlePageChange = createAsyncThunk(
  'billingAddress/handlePageChange',
  async ({ offset, limit, id }, { dispatch }) => {
    dispatch(getAllBillingAddressAction({ offset, limit, id }))
  }
)

// ** Handling Limit
export const handleLimitChange = createAsyncThunk(
  'billingAddress/handleLimitChange',
  async ({ oldLimit, newLimit, id }, { dispatch }) => {
    if (newLimit !== oldLimit) {
      dispatch(getAllBillingAddressAction({ offset: 0, limit: newLimit, id }))
    }
  }
)

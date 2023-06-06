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

//** Get invoice  */
export const getInvoiceAction = createAsyncThunk(
  'invoice/getInvoice',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await useJwt.getInvoice(id)
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)


//** Update invoice  */
export const updateInvoiceAction = createAsyncThunk(
  'invoice/updateInvoice',
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await useJwt.updateInvoice(id, data)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Invoice Updated Successfully'}
          icon={<Check size={14} />}
          color="success"
          // msg={response?.data?.message}
        />
      ))
      dispatch(getInvoiceAction({ id }))
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

//** Get Superbills  */
export const getSuperBillsAction = createAsyncThunk(
  'invoice/getSuperBills',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await useJwt.getSuperBills(id)
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

//** Update invoice  */
export const updateSuperBillsAction = createAsyncThunk(
  'invoice/updateSuperBills',
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await useJwt.updateSuperBills(id, data)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Superbill Updated Successfully'}
          icon={<Check size={14} />}
          color="success"
          // msg={response?.data?.message}
        />
      ))
      dispatch(getSuperBillsAction({ id }))
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

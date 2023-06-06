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

export const getAllReportsAction = createAsyncThunk(
  'reports/getAllReports',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await useJwt.getAllReports()

      return response.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching  Reports'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const getAllMonthlyIncomeReportsAction = createAsyncThunk(
  'reports/getAllMonthlyIncome',
  async ({ offset, limit }, { rejectWithValue }) => {
    try {
      const response = await useJwt.getAllMonthlyIncomeReports({
        offset,
        limit
      })

      return response.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Monthly Income Reports'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const getAllMonthlyInvoiceReportsAction = createAsyncThunk(
  'reports/getAllMonthlyInvoiceReports',
  async ({ offset, limit }, { rejectWithValue }) => {
    try {
      const response = await useJwt.getAllMonthlyInvoiceReports({
        offset,
        limit
      })

      return response.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Monthly Invoice Reports'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const getAllPayoutReportsAction = createAsyncThunk(
  'reports/getAllPayoutReports',
  async ({ offset, limit }, { rejectWithValue }) => {
    try {
      const response = await useJwt.getAllPayoutReports({
        offset,
        limit
      })

      return response.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Payout Reports'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const getAllMonthlyClientsDetailsAction = createAsyncThunk(
  'reports/getAllMonthlyClientsDetails',
  async (payload, { rejectWithValue }) => {
    const { offset, limit, startDate, endDate, status } = payload
    try {
      const response = await useJwt.getAllMonthlyClientsDetails({
        offset,
        limit,
        startDate,
        endDate,
        status
      })

      return response.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Client Details Report'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const getAllSessionAttendanceAction = createAsyncThunk(
  'reports/getAllSessionAttendance',
  async ({ offset, limit, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await useJwt.getAllSessionAttendance({
        offset,
        limit,
        startDate,
        endDate
      })

      return response.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Session Attendance'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const getAllCoverageReportsAction = createAsyncThunk(
  'reports/getAllCoverageReports',
  async ({ offset, limit }, { rejectWithValue }) => {
    try {
      const response = await useJwt.getAllCoverageReports({
        offset,
        limit
      })

      return response.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Coverage Reports'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

//** get client payment */
export const getClientPaymentAction = createAsyncThunk(
  'reports/getClientPayment',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await useJwt.getClientPayment()
      return response.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Client Payment'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)


// ** Handling Pagination
export const handlePageChange = createAsyncThunk(
  'reports/handlePageChange',
  async (
    { offset, limit, startDate, endDate, status, attendance },
    { dispatch }
  ) => {
    if (attendance) {
      dispatch(
        getAllSessionAttendanceAction({
          offset,
          limit,
          startDate,
          endDate
        })
      )
    } else {
      dispatch(
        getAllMonthlyClientsDetailsAction({
          offset,
          limit,
          status,
          startDate,
          endDate
        })
      )
    }
  }
)

// ** Handling Limit
export const handleLimitChange = createAsyncThunk(
  'reports/handleLimitChange',
  async (
    { oldLimit, newLimit, startDate, endDate, status, attendance },
    { dispatch }
  ) => {
    if (newLimit !== oldLimit) {
      if (attendance) {
        dispatch(
          getAllSessionAttendanceAction({
            offset: 0,
            limit: newLimit,
            startDate,
            endDate
          })
        )
      } else {
        dispatch(
          getAllMonthlyClientsDetailsAction({
            offset: 0,
            limit: newLimit,
            status,
            startDate,
            endDate
          })
        )
      }
    }
  }
)

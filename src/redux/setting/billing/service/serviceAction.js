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

// ** Get All service
export const getAllServiceAction = createAsyncThunk(
  'service/getAllServiceAction',
  async ({ id, offset, limit }, { rejectWithValue }) => {
    try {
      const response = await useJwt.getAllService(id, offset, limit)

      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Services'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.msg}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

//** Register Service */
export const registerServiceAction = createAsyncThunk(
  'service/registerService',
  async ({ data, id, callback }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.registerService(data)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Register Service Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.msg}
        />
      ))
      callback()
      dispatch(getAllServiceAction({ id, offset: 0, limit: 10 }))
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Register Service'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.non_field_errors[0]}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Get Service By Id
export const getServiceByIdAction = createAsyncThunk(
  'service/getServiceById',
  async ({ providerId, id }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.getServiceById(providerId, id)

      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Register Service'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.msg}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Get Service By Id
export const updateServiceAction = createAsyncThunk(
  'service/updateService',
  async (
    { data, serviceId, providerId, callback },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await useJwt.updateService(data, serviceId)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Update Service Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.msg}
        />
      ))
      callback()
      dispatch(getAllServiceAction({ id: providerId, offset: 0, limit: 10 }))
      return response?.data
    } catch (err) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Get Service By Id
export const deleteServiceAction = createAsyncThunk(
  'service/deleteService',
  async ({ providerId, id, callback }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.deleteService(id)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Delete Service Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.msg}
        />
      ))
      callback()
      dispatch(getAllServiceAction({ id: providerId, offset: 0, limit: 10 }))

      return response?.data
    } catch (err) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Handling Pagination
export const handlePageChange = createAsyncThunk(
  'service/handlePageChange',
  async ({ id, offset, limit }, { dispatch }) => {
    dispatch(
      getAllServiceAction({
        id,
        offset,
        limit
      })
    )
  }
)

// ** Handling Limit
export const handleLimitChange = createAsyncThunk(
  'service/handleLimitChange',
  async ({ id, oldLimit, newLimit }, { dispatch }) => {
    if (newLimit !== oldLimit) {
      dispatch(
        getAllServiceAction({
          id,
          offset: 0,
          limit: newLimit
        })
      )
    }
  }
)

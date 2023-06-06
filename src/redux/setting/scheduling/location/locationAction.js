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
// ** Get All Location
export const getAllLocationAction = createAsyncThunk(
  'location/getAllLocationAction',
  async ({ offset, limit, id }, { rejectWithValue }) => {
    try {
      const response = await useJwt.getAllLocation(offset, limit, id)
      return response?.data
    } catch (err) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Get Single Location
export const getLocationAction = createAsyncThunk(
  'location/getLocationAction',
  async ({ providerId, locationId }, { rejectWithValue }) => {
    try {
      const response = await useJwt.getLocation(providerId, locationId)

      return response?.data
    } catch (err) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Add Location
export const registerLocationAction = createAsyncThunk(
  'location/registerLocation',
  async ({ id, data, callback }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.registerLocation(id, data)

      toast((t) => (
        <ToastContent
          t={t}
          name={'Register Location Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.msg}
        />
      ))
      callback()
      dispatch(getAllLocationAction({ offset: 0, limit: 5, id }))
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)
// ** Update Location
export const updateLocationAction = createAsyncThunk(
  'location/updateLocation',
  async (
    { offset, limit, providerId, id, data },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await useJwt.updateLocation(id, data)
      if (response?.data) {
        toast((t) => (
          <ToastContent
            t={t}
            name={'Update Location Successfully'}
            icon={<Check size={14} />}
            color="success"
            msg={response?.data?.message}
          />
        ))
      }
      dispatch(getAllLocationAction({ offset, limit, id: providerId }))
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Delete Location
export const deleteLocationAction = createAsyncThunk(
  'location/deleteLocation',
  async (
    { limit, id, providerId, callback },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await useJwt.deleteLocation(id)

      toast((t) => (
        <ToastContent
          t={t}
          name="Location Deleted Successfully"
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      callback()
      dispatch(getAllLocationAction({ offset: 0, limit, id: providerId }))
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Handling Pagination
export const handlePageChange = createAsyncThunk(
  'location/handlePageChange',
  async ({ offset, limit, id }, { dispatch }) => {
    dispatch(getAllLocationAction({ offset, limit, id }))
  }
)

// ** Handling Limit
export const handleLimitChange = createAsyncThunk(
  'location/handleLimitChange',
  async ({ oldLimit, newLimit, id }, { dispatch }) => {
    if (newLimit !== oldLimit) {
      dispatch(getAllLocationAction({ offset: 0, limit: newLimit, id }))
    }
  }
)

/* eslint-disable no-unused-vars */
import useJwt from '@src/auth/jwt/useJwt'
import { createAsyncThunk } from '@reduxjs/toolkit'

// ** components
import toast from 'react-hot-toast'
import { Check, X } from 'react-feather'
import { ToastContent } from '@src/components/toast'

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

// ** get all  Other Documents
export const getAllOtherDocumentsAction = createAsyncThunk(
  'otherDocument/getAllOtherDocuments',
  async ({ offset, limit }, { rejectWithValue }) => {
    try {
      const res = await useJwt.getAllOtherDocuments(offset, limit)
      return res?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err)
    }
  }
)

// ** Register Other Documents
export const registerOtherDocumentsAction = createAsyncThunk(
  'otherDocument/registerOtherDocuments',
  async ({ data, callback, offset, limit }, { rejectWithValue, dispatch }) => {
    try {
      const res = await useJwt.registerOtherDocuments(data)
      toast((t) => (
        <ToastContent
          t={t}
          name="Other Document Registered Successfully"
          icon={<Check size={14} />}
          color="success"
          msg={res?.data?.msg}
        />
      ))
      dispatch(getAllOtherDocumentsAction({ offset, limit }))
      callback()
      return res?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err)
    }
  }
)

// ** update Other Documents
export const updateOtherDocumentsAction = createAsyncThunk(
  'otherDocument/updateOtherDocuments',
  async ({id, data, callback, offset, limit }, { rejectWithValue, dispatch }) => {
    try {
      const res = await useJwt.updateOtherDocuments(id, data)
      toast((t) => (
        <ToastContent
          t={t}
          name="Other Document Updated Successfully"
          icon={<Check size={14} />}
          color="success"
          msg={res?.data?.msg}
        />
      ))
      callback()
      dispatch(getAllOtherDocumentsAction({ offset, limit }))
      return res?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err)
    }
  }
)

// ** Delete other Documents
export const deleteOtherDocumentsAction = createAsyncThunk(
  'otherDocument/deleteOtherDocuments',
  async ({ id, limit }, { rejectWithValue, dispatch }) => {
    try {
      const response = await useJwt.deleteOtherDocuments(id)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Other Documents Deleted Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      dispatch(getAllOtherDocumentsAction({ offset: 0, limit }))
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Client Documents'}
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
  'otherDocument/handlePageChange',
  async ({ offset, limit }, { dispatch }) => {
    dispatch(
      getAllOtherDocumentsAction({
        offset,
        limit
      })
    )
  }
)

// ** Handling Limit
export const handleLimitChange = createAsyncThunk(
  'otherDocument/handleLimitChange',
  async ({ oldLimit, newLimit }, { dispatch }) => {
    if (newLimit !== oldLimit) {
      dispatch(
        getAllOtherDocumentsAction({
          offset: 0,
          limit: newLimit
        })
      )
    }
  }
)

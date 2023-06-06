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

// ** Get all stripe cards
export const getAllStripeCardAction = createAsyncThunk(
  'stripe/getAllStripeCard',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.getAllStripeCard()
      return response?.data
    } catch (err) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** add stripe card
export const registerStripeCardAction = createAsyncThunk(
  'stripe/registerStripeCard',
  async ({ data, callback }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.registerStripeCard(data)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Card Added Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.msg}
        />
      ))
      callback()
      dispatch(getAllStripeCardAction())
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** add stripe more card
export const registerMoreStripeCardAction = createAsyncThunk(
  'stripe/registerMoreStripeCard',
  async ({ data, callback }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.registerMoreStripeCard(data)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Card Added Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.msg}
        />
      ))
      callback()
      dispatch(getAllStripeCardAction())
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Register Card'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data[0]}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** update default card
export const updateStripeCardAction = createAsyncThunk(
  'stripe/updateStripeCard',
  async ({ data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.updateStripeCard(data)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Set Default Card Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.msg}
        />
      ))
      dispatch(getAllStripeCardAction())
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Register Card'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.msg}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Delete stripe card
export const deleteStripeCardAction = createAsyncThunk(
    'stripe/deleteStripeCard',
    async ({ id, callback }, { dispatch, rejectWithValue }) => {
      try {
        const response = await useJwt.deleteStripeCard(id)
        toast((t) => (
          <ToastContent
            t={t}
            name={'Card Deleted Successfully'}
            icon={<Check size={14} />}
            color="success"
            msg={response?.data?.msg}
          />
        ))
        callback()
        dispatch(getAllStripeCardAction())
        return response?.data
      } catch (err) {
        toast((t) => (
          <ToastContent
            t={t}
            name={'Error Register Card'}
            icon={<X size={14} />}
            color="danger"
            msg={err?.response?.data?.msg}
          />
        ))
        return rejectWithValue(err?.response?.data)
      }
    }
  )
  
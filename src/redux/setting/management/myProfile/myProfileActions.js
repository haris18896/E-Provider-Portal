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

// ** Get  Provider Profile
export const getProviderProfileAction = createAsyncThunk(
  'providerProfile/getProviderProfileAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await useJwt.getProviderProfile()
      return response?.data
    } catch (err) {
      return rejectWithValue(err?.response?.data)
    }
  }
)


// ** Get  Provider Profile
export const updateProviderImageAction = createAsyncThunk(
    'provider/updateImage',
    async ({ id, image, navigate }, { rejectWithValue, dispatch }) => {
      try {
        const response = await useJwt.updateProviderImage(id, image)
        toast((t) => (
          <ToastContent
            t={t}
            name="Provider Image Update Successfully"
            icon={<Check size={14} />}
            color="success"
            msg={response?.data?.message}
          />
        ))

        navigate("/settings/my-profile")
        return response?.data
      } catch (err) {
        fieldErrors(err)
        return rejectWithValue(err?.response?.data)
      }
    }
  )

// ** Get  Provider Profile
export const updateProviderProfileAction = createAsyncThunk(
  'providerProfile/updateProviderProfileAction',
  async ({ id, data, image, navigate }, { rejectWithValue, dispatch }) => {
    try {
      const response = await useJwt.updateProviderProfile(id, data)
      if (!!(image && id)) {
        dispatch(updateProviderImageAction({ id, image, navigate }))
      }
      if (response?.data && !(image && id)) {
        toast((t) => (
          <ToastContent
            t={t}
            name="Provider Update Successfully"
            icon={<Check size={14} />}
            color="success"
            msg={response?.data?.message}
          />
        ))

        // dispatch(getProviderProfileAction())
        navigate("/settings/my-profile")
      }

      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

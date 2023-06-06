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

// ** Get All Templates
export const GetAllTemplatesAction = createAsyncThunk(
  'document/get-all-templates',
  async ({ callback }, { rejectWithValue }) => {
    try {
      const res = await useJwt.getAllTemplates()

      if (res?.data?.result) {
        callback(res?.data?.result)
      }
      return res?.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Checked Templates
export const CheckedTemplatesByIdAction = createAsyncThunk(
  'document/check-templates-by-id',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await useJwt.checkedTemplates(id, data)

      return res?.data
    } catch (err) {
      fieldErrors(err)
      rejectWithValue(err?.response?.data)
    }
  }
)

// ** Get Template By id
export const GetTemplateByIdAction = createAsyncThunk(
  'document/get-template-by-id',
  async ({ id, callback }, { rejectWithValue }) => {
    try {
      const res = await useJwt.getTemplateById(id)
      if (res?.data?.id) {
        callback(res?.data)
      }
      return res?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err)
    }
  }
)

// ** Delete Template
export const DeleteTemplatesAction = createAsyncThunk(
  'document/delete-templates-by-id',
  async ({ id, callback }, { dispatch, rejectWithValue }) => {
    try {
      const res = await useJwt.deleteTemplate(id)
      if (res?.status === 204) {
        dispatch(GetAllTemplatesAction({ callback }))
      }
      return res?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Create Template
export const createTemplateAction = createAsyncThunk(
  'document/create-template',
  async ({ data, callback }, { rejectWithValue }) => {
    try {
      const response = await useJwt.createTemplate(data)

      if (response?.data) {
        callback()
        toast((t) => (
          <ToastContent
            t={t}
            name={'Template has been created'}
            icon={<Check size={14} />}
            color="success"
          />
        ))
      }
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Something went wrong with creating template'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Cloning Template
export const CloningTemplateAction = createAsyncThunk(
  'document/cloning-template',
  async ({ id, callback }, { dispatch, rejectWithValue }) => {
    try {
      // dispatch GetTemplateByIdAction
      const template = await dispatch(GetTemplateByIdAction(id)).unwrap()
      // get the response of GetTemplateByIdAction
      const data = {
        title: `${template?.title} - copy`,
        type: template?.type,
        content: template?.content
      }

      const res = await useJwt.createTemplate(data)

      if (res?.data) {
        toast((t) => (
          <ToastContent
            t={t}
            name={'Template has been cloned'}
            icon={<Check size={14} />}
            color="success"
          />
        ))
        dispatch(GetAllTemplatesAction({ callback }))
      }

      return res?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Update Template
export const UpdateTemplateAction = createAsyncThunk(
  'document/update-template',
  async ({ id, data, callback }, { rejectWithValue }) => {
    try {
      const res = await useJwt.updateTemplate(id, data)
      if (res?.data?.id) {
        callback()
      }
      return res?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

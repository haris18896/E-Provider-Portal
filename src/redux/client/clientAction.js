/* eslint-disable no-unused-vars */
import jwt_decode from 'jwt-decode'
import useJwt from '@src/auth/jwt/useJwt'
import { createAsyncThunk } from '@reduxjs/toolkit'

// components
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

// ** Get All Providers List
export const getAllClientsAction = createAsyncThunk(
  'client/getAllClients',
  async (payload, { rejectWithValue }) => {
    const { offset, limit, startDate, endDate, search, status } = payload
    try {
      const response = await useJwt.getAllClients(
        offset,
        limit,
        startDate,
        endDate,
        search,
        status
      )

      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Providers'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Get Provider
export const getClientAction = createAsyncThunk(
  'client/getClient',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await useJwt.getClient(id)

      return response?.data
    } catch (err) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Get Provider
export const getClientInvoiceAction = createAsyncThunk(
  'client/getClientInvoice',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await useJwt.getClientInvoice(id)

      return response?.data
    } catch (err) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

//** Upload Client Insurance Card  */
export const uploadInsuranceCardImageAction = createAsyncThunk(
  'client/uploadInsuranceCardImage',
  async ({ id, img, navigate }, { rejectWithValue }) => {
    try {
      const response = await useJwt.uploadInsuranceCardImage(id, img)
      toast((t) => (
        <ToastContent
          t={t}
          name="Client Added Successfully"
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      navigate('/clients')
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

// **  Update Client Insurance Card **
export const updateClientImageAction = createAsyncThunk(
  'client/updateClientImage',
  async ({ id, img, navigate }, { rejectWithValue }) => {
    try {
      const response = await useJwt.updateClientImage(id, img)
      toast((t) => (
        <ToastContent
          t={t}
          name="Client Image Update Successfully"
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))

      navigate('/clients')
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Update Client
export const updateClientAction = createAsyncThunk(
  'client/updateClient',
  async ({ id, data, img, navigate }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.updateClient(id, data)
      if (!!(img && id)) {
        dispatch(updateClientImageAction({ id, img, navigate }))
      }

      if (response?.data && !(img && id)) {
        toast((t) => (
          <ToastContent
            t={t}
            name="Client Updated Successfully"
            icon={<Check size={14} />}
            color="success"
            msg={response?.data?.message}
          />
        ))
        navigate('/clients')
        // callback()
      }

      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Add Client
export const registerClient = createAsyncThunk(
  'client/registerClient',
  async ({ data, img, navigate }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.registerClient(data)

      const token = await response?.data?.access
      const decoded = await jwt_decode(token)
      const id = await decoded?.user_id
      if (!!(img && id)) {
        const imageData = new FormData()
        imageData.append('image', img)

        dispatch(
          uploadInsuranceCardImageAction({ id, img: imageData, navigate })
        )
      }

      if (response?.data && !(img && id)) {
        toast((t) => (
          <ToastContent
            t={t}
            name={'Client Added Successfully'}
            icon={<Check size={14} />}
            color="success"
            msg={response?.data?.message}
          />
        ))
        navigate('/clients')
      }

      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Get All Client Billings List
export const getAllClientBillingAction = createAsyncThunk(
  'client/getAllClientBilling',
  async (payload, { rejectWithValue }) => {
    const { offset, limit, status, client } = payload
    try {
      const response = await useJwt.getAllClientBilling(
        offset,
        limit,
        status,
        client
      )
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Providers'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Get Client Billings List
export const getClientBillingAction = createAsyncThunk(
  'client/getClientBilling',
  async ({ id, callback }, { rejectWithValue }) => {
    try {
      const response = await useJwt.getClientBilling(id)
      if (response?.data) {
        callback(response?.data)
      }
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Billing1324'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Get Client Billings List
export const updateClientBillingAction = createAsyncThunk(
  'client/updateClientBilling',
  async ({ id, data, callback }, { rejectWithValue }) => {
    try {
      const response = await useJwt.updateClientBilling(id, data)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Billing updated Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      callback()
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Updating Billing'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Delete  Client
export const deleteClientAction = createAsyncThunk(
  'client/deleteClient',
  async ({ id, navigate, callback }, { rejectWithValue }) => {
    try {
      const response = await useJwt.deleteClient(id)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Client Deleted Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      callback()
      navigate('/clients')
      return response?.data
    } catch (err) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Get Client Appointments
export const getClientAppointmentsAction = createAsyncThunk(
  'client/get-client-appointments',
  async ({ id, status, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await useJwt.getClientAppointments({
        id,
        status,
        endDate,
        startDate
      })

      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Client Appointments'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const getClientNotesAction = createAsyncThunk(
  'client/client-notes',
  async (payload, { rejectWithValue, fulfillWithValue }) => {
    try {
      const res = await useJwt.clientNotes()

      return fulfillWithValue({ result: res.data.result || [] })
    } catch (err) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

//** Create Client Invoice */
export const createClientInvoiceAction = createAsyncThunk(
  'client/createClientInvoiceAction',
  async ({ data, callback }, { rejectWithValue }) => {
    try {
      const response = await useJwt.createClientInvoice(data)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Invoice Created Successfully '}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      callback()
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Create Invoice'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Get Client Appointments
export const deleteClientInvoiceAction = createAsyncThunk(
  'client/deleteClientInvoice',
  async ({ id, callback }, { rejectWithValue }) => {
    try {
      const response = await useJwt.deleteClientInvoice(id)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Invoice Deleted Successfully '}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      callback()
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Client Appointments'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Get All Client Billings List
export const getAllClientDocumentsAction = createAsyncThunk(
  'client/getAllClientDocuments',
  async (payload, { rejectWithValue }) => {
    const { id } = payload
    try {
      const response = await useJwt.getAllClientDocuments(id)
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

// ** Register Client Documents
export const registerClientDocumentsAction = createAsyncThunk(
  'client/registerClientDocuments',
  async ({ data, id, callback }, { rejectWithValue, dispatch }) => {
    try {
      const response = await useJwt.registerClientDocuments(data)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Client Documents Registered Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      callback()
      dispatch(getAllClientDocumentsAction({ id }))
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

// ** Delete Client Documents
export const deleteClientDocumentsAction = createAsyncThunk(
  'client/deleteClientDocuments',
  async ({ id, clientId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await useJwt.deleteClientDocuments(id)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Client Documents Deleted Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      dispatch(getAllClientDocumentsAction({ id: clientId }))
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

// ** handle client appointments pagination
export const handleClientAppointmentsPagination = createAsyncThunk(
  'client/handle-client-appointments-pagination',
  async ({ id, offset, limit, startDate, endDate, status }, { dispatch }) => {
    dispatch(
      getClientAppointmentsAction({
        id,
        offset,
        limit,
        startDate,
        endDate,
        status
      })
    )
  }
)

export const handleClientAppointmentsLimitChange = createAsyncThunk(
  'client/client-appointments-limit-change',
  async (
    { id, oldLimit, newLimit, startDate, endDate, status },
    { dispatch, rejectWithValue }
  ) => {
    if (newLimit !== oldLimit) {
      dispatch(
        getClientAppointmentsAction({
          id,
          offset: 0,
          limit: newLimit,
          startDate,
          endDate,
          status
        })
      )
    }
  }
)

// ** Handling Pagination
export const handlePageChange = createAsyncThunk(
  'client/handlePageChange',
  async (
    { offset, limit, startDate, endDate, search, client, clients, status },
    { dispatch }
  ) => {
    if (!clients) {
      dispatch(
        getAllClientBillingAction({
          offset,
          limit,
          status,
          client
        })
      )
    } else {
      dispatch(
        getAllClientsAction({
          offset,
          limit,
          status,
          startDate,
          endDate,
          search
        })
      )
    }
  }
)

// ** Handling Limit
export const handleLimitChange = createAsyncThunk(
  'client/handleLimitChange',
  async (
    { oldLimit, newLimit, search, startDate, endDate, client, clients, status },
    { dispatch }
  ) => {
    if (newLimit !== oldLimit) {
      if (!clients) {
        dispatch(
          getAllClientBillingAction({
            offset: 0,
            limit: newLimit,
            status,
            client
          })
        )
      } else {
        dispatch(
          getAllClientsAction({
            offset: 0,
            limit: newLimit,
            status,
            startDate,
            endDate,
            search
          })
        )
      }
    }
  }
)

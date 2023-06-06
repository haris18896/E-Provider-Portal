/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'
import {
  registerClient,
  getClientAction,
  deleteClientAction,
  updateClientAction,
  getAllClientsAction,
  updateClientImageAction,
  getAllClientBillingAction,
  getClientAppointmentsAction,
  uploadInsuranceCardImageAction,
  createClientInvoiceAction,
  getClientBillingAction,
  updateClientBillingAction,
  deleteClientInvoiceAction,
  getClientNotesAction,
  getAllClientDocumentsAction,
  getClientInvoiceAction,
  registerClientDocumentsAction,
  deleteClientDocumentsAction
} from './clientAction'

export const ClientReducer = createSlice({
  name: 'client',
  initialState: {
    loading: false,
    loadingImage: false,
    updateLoading: false,
    deleteLoading: false,
    clientNotesPending: false,
    clientAppointmentsPending: false,
    getClientBillingLoading: false,
    updateClientBillingLoading: false,
    deleteClientInvoiceLoading: false,
    createClientInvoiceLoading: null,
    getAllClientDocumentsLoading: false,
    getAllClientBillingLoading: false,
    getClientInvoiceLoading: false,
    registerDocumentLoading: false,
    deleteDocumentLoading: false,
    getAllClientsData: {
      clientsList: [],
      count: 0,
      offset: 0,
      limit: 10
    },
    getAllClientBillingData: {
      clientBillingList: [],
      count: 0,
      offset: 0,
      limit: 10
    },
    clientNotes: [],
    getClient: null,
    imageError: null,
    updateClient: null,
    registerClient: null,
    clientAppointments: {
      limit: 10,
      offset: 0,
      count: 0,
      data: []
    },
    uploadImageError: null,
    updateImageError: null,
    getClientBilling: null,
    getClientInvoice: null,
    createClientInvoice: null,
    updateClientBilling: null,
    registerClientDocuments: null,
    getAllClientDocumentsData: null,
    error: null
  },
  reducers: {
    resetGetClientInvoice: (state) => {
      state.getClientInvoice = null
    },
    resetGetAllClients: (state) => {
      state.getAllClientsData = {
        clientsList: [],
        count: 0,
        offset: 0,
        limit: 10
      }
    },
    resetGetAllClientBilling: (state) => {
      state.getAllClientBillingData = {}
    },

    resetGetClient: (state) => {
      state.getClient = null
    },
    resetRegisterClient: (state) => {
      state.registerClient = {}
    },
    resetUpdateClient: (state) => {
      state.updateClient = {}
    },
    resetClientAppointments: (state) => {
      state.clientAppointments = {
        limit: 10,
        offset: 0,
        data: []
      }
    },
    resetClientNotes: (state) => {
      state.clientNotes = []
    },
    resetClientBilling: (state) => {
      state.getClientBilling = []
    }
  },
  extraReducers: (builder) => {
    const success = (state) => {
      state.loading = false
      state.error = null
    }

    const error = (state, action) => {
      state.loading = false
      state.error = action.payload
    }

    builder

      //**  Register Client */
      .addCase(registerClient.pending, (state) => {
        state.loading = true
      })
      .addCase(registerClient.fulfilled, (state, action) => {
        success(state)
        state.registerClient = action.payload
      })
      .addCase(registerClient.rejected, (state, action) => {
        error(state, action)
        state.registerClient = null
      })

      //**  Register Client Documents */
      .addCase(registerClientDocumentsAction.pending, (state) => {
        state.registerDocumentLoading = true
      })
      .addCase(registerClientDocumentsAction.fulfilled, (state, action) => {
        state.registerDocumentLoading = false
        state.registerClientDocuments = action.payload
        state.error = null
      })
      .addCase(registerClientDocumentsAction.rejected, (state, action) => {
        state.registerDocumentLoading = false
        state.error = action.payload
        state.registerClientDocuments = null
      })

      // get all  Client documents
      .addCase(getAllClientDocumentsAction.pending, (state) => {
        state.getAllClientDocumentsLoading = true
      })
      .addCase(getAllClientDocumentsAction.fulfilled, (state, action) => {
        state.getAllClientDocumentsLoading = false
        state.getAllClientDocumentsData = action.payload
        state.error = null
      })
      .addCase(getAllClientDocumentsAction.rejected, (state, action) => {
        state.getAllClientDocumentsLoading = false
        state.getAllClientDocumentsData = null
        state.error = action.payload
      })

      // Update Client
      .addCase(updateClientAction.pending, (state) => {
        state.updateLoading = true
      })
      .addCase(updateClientAction.fulfilled, (state, action) => {
        state.updateLoading = false
        state.updateClient = action.payload
        state.error = null
      })
      .addCase(updateClientAction.rejected, (state, action) => {
        state.updateLoading = false
        state.updateClient = null
        state.error = action.payload
      })

      // update image
      .addCase(updateClientImageAction.pending, (state) => {
        state.loadingImage = true
      })
      .addCase(updateClientImageAction.fulfilled, (state) => {
        state.imageError = null
        state.loadingImage = false
      })
      .addCase(updateClientImageAction.rejected, (state, action) => {
        state.loadingImage = false
        state.updateImageError = action.payload
      })

      // upload Insurance image
      .addCase(uploadInsuranceCardImageAction.pending, (state) => {
        state.loadingImage = true
      })
      .addCase(uploadInsuranceCardImageAction.fulfilled, (state) => {
        state.uploadImageError = null
        state.loadingImage = false
      })
      .addCase(uploadInsuranceCardImageAction.rejected, (state, action) => {
        state.loadingImage = false
        state.uploadImageError = action.payload
      })

      //**  Get All Clients */
      .addCase(getAllClientsAction.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllClientsAction.fulfilled, (state, action) => {
        success(state)
        state.getAllClientsData.clientsList = action.payload?.result
        state.getAllClientsData.count = action.payload?.count
        state.getAllClientsData.offset = action.payload?.offset
        state.getAllClientsData.limit = action.payload?.limit
      })
      .addCase(getAllClientsAction.rejected, (state, action) => {
        error(state, action)
        state.getAllClientsData.providersList = []
        state.getAllClientsData.count = 0
      })

      //** Get Client */
      .addCase(getClientAction.pending, (state) => {
        state.loading = true
      })
      .addCase(getClientAction.fulfilled, (state, action) => {
        success(state)
        state.getClient = action.payload
      })
      .addCase(getClientAction.rejected, (state, action) => {
        error(state, action)
        state.getClient = null
      })

      //**  get  Client invoice */
      .addCase(getClientInvoiceAction.pending, (state) => {
        state.getClientInvoiceLoading = true
      })
      .addCase(getClientInvoiceAction.fulfilled, (state, action) => {
        state.getClientInvoiceLoading = false
        state.getClientInvoice = action.payload
      })
      .addCase(getClientInvoiceAction.rejected, (state, action) => {
        state.error = action.payload
        state.getClientInvoice = []
        state.getClientInvoiceLoading = false
      })

      //** Delete Client */
      .addCase(deleteClientAction.pending, (state) => {
        state.deleteLoading = true
      })
      .addCase(deleteClientAction.fulfilled, (state, action) => {
        state.deleteLoading = false
        state.error = null
      })
      .addCase(deleteClientAction.rejected, (state, action) => {
        state.deleteLoading = false
        state.error = action.payload
      })

      //** Delete Client Document*/
      .addCase(deleteClientDocumentsAction.pending, (state) => {
        state.deleteDocumentLoading = true
      })
      .addCase(deleteClientDocumentsAction.fulfilled, (state, action) => {
        state.deleteDocumentLoading = false
        state.error = null
      })
      .addCase(deleteClientDocumentsAction.rejected, (state, action) => {
        state.deleteDocumentLoading = false
        state.error = action.payload
      })

      //**  Get All Client Billings */
      .addCase(getAllClientBillingAction.pending, (state) => {
        state.getAllClientBillingLoading = true
      })
      .addCase(getAllClientBillingAction.fulfilled, (state, action) => {
        state.getAllClientBillingLoading = false
        state.getAllClientBillingData.clientBillingList = action.payload?.result
        state.getAllClientBillingData.count = action.payload?.count
        state.getAllClientBillingData.offset = action.payload?.offset
        state.getAllClientBillingData.limit = action.payload?.limit
      })
      .addCase(getAllClientBillingAction.rejected, (state, action) => {
        state.getAllClientBillingLoading = false
        state.getAllClientBillingData.providersList = []
        state.getAllClientBillingData.count = 0
        state.error = action.payload
      })

      //**  Get  Client Billings */
      .addCase(getClientBillingAction.pending, (state) => {
        state.getClientBillingLoading = true
      })
      .addCase(getClientBillingAction.fulfilled, (state, action) => {
        state.getClientBillingLoading = false
        state.getClientBilling = action.payload
      })
      .addCase(getClientBillingAction.rejected, (state, action) => {
        state.error = action.payload
        state.getClientBilling = []
        state.getClientBillingLoading = false
      })

      //**  Update  Client Billings */
      .addCase(updateClientBillingAction.pending, (state) => {
        state.updateClientBillingLoading = true
      })
      .addCase(updateClientBillingAction.fulfilled, (state, action) => {
        state.updateClientBillingLoading = false
        state.updateClientBilling = action.payload
      })
      .addCase(updateClientBillingAction.rejected, (state, action) => {
        state.error = action.payload
        state.updateClientBilling = []
        state.updateClientBillingLoading = false
      })

      // ** get Client Appointments
      .addCase(getClientAppointmentsAction.pending, (state) => {
        state.clientAppointmentsPending = true
      })
      .addCase(getClientAppointmentsAction.fulfilled, (state, action) => {
        state.clientAppointmentsPending = false
        state.clientAppointments.data = action.payload?.result
        state.clientAppointments.offset = action.payload?.offset
        state.clientAppointments.limit = action.payload?.limit
        state.clientAppointments.count = action.payload?.count
      })
      .addCase(getClientAppointmentsAction.rejected, (state, action) => {
        state.error = action.payload
        state.clientAppointments = []
        state.clientAppointmentsPending = false
      })

      // ** Register Client Invoice
      .addCase(createClientInvoiceAction.pending, (state) => {
        state.createClientInvoiceLoading = true
      })
      .addCase(createClientInvoiceAction.fulfilled, (state, action) => {
        state.createClientInvoiceLoading = false
        state.createClientInvoice = action.payload?.result
      })
      .addCase(createClientInvoiceAction.rejected, (state, action) => {
        state.error = action.payload
        state.createClientInvoice = []
        state.createClientInvoiceLoading = false
      })

      //**  Get Client Notes
      .addCase(getClientNotesAction.pending, (state) => {
        state.clientNotesPending = true
      })
      .addCase(getClientNotesAction.fulfilled, (state, action) => {
        success(state)
        state.clientNotes = action.payload.result
        state.clientNotesPending = false
      })
      .addCase(getClientNotesAction.rejected, (state, action) => {
        error(state, action)
        state.clientNotes = []
        state.clientNotesPending = false
        state.error = action.payload
      })

      // ** Delete Client Invoice
      .addCase(deleteClientInvoiceAction.pending, (state) => {
        state.deleteClientInvoiceLoading = true
      })
      .addCase(deleteClientInvoiceAction.fulfilled, (state, action) => {
        state.deleteClientInvoiceLoading = false
        state.error = null
      })
      .addCase(deleteClientInvoiceAction.rejected, (state, action) => {
        state.error = action.payload
        state.deleteClientInvoiceLoading = false
      })
  }
})

export const {
  resetGetClient,
  resetClientNotes,
  resetUpdateClient,
  resetClientBilling,
  resetGetAllClients,
  resetRegisterClient,
  resetClientAppointments,
  resetGetAllClientBilling,
  resetGetClientInvoice
} = ClientReducer.actions

export default ClientReducer.reducer

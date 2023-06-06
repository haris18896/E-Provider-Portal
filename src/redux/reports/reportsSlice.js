import { createSlice } from '@reduxjs/toolkit'

import {
  getAllMonthlyIncomeReportsAction,
  getAllMonthlyInvoiceReportsAction,
  getAllPayoutReportsAction,
  getAllMonthlyClientsDetailsAction,
  getAllSessionAttendanceAction,
  getAllCoverageReportsAction,
  getAllReportsAction,
  getClientPaymentAction
} from './reportsAction'

export const ReportsReducer = createSlice({
  name: 'reports',
  initialState: {
    coverageReport: false,
    payoutReportPending: false,
    getAllReportsLoading: false,
    getClientPaymentLoading: false,
    sessionAttendanceReport: false,
    monthlyIncomeReportPending: false,
    monthlyInvoiceReportPending: false,
    clientDetailsReportsPending: false,

    monthlyIncomeReportList: {
      data: [],
      offset: 0,
      limit: 10,
      total: 0
    },
    monthlyInvoiceReportList: {
      data: [],
      offset: 0,
      limit: 10,
      total: 0
    },
    payoutReportList: {
      data: [],
      offset: 0,
      limit: 10,
      total: 0
    },
    clientDetailsReportList: {
      data: [],
      offset: 0,
      limit: 10,
      total: 0
    },
    sessionReportList: {
      data: [],
      offset: 0,
      limit: 10,
      total: 0
    },
    coverageReportList: {
      data: [],
      offset: 0,
      limit: 10,
      total: 0
    },
    error: null,
    getReports: null,
    getClientPayment: null
  },
  reducers: {
    resetMonthlyIncomeReport: (state) => {
      state.monthlyIncomeReportList = {
        data: [],
        offset: 0,
        limit: 10,
        total: 0
      }
    },
    resetMonthlyInvoiceReport: (state) => {
      state.monthlyInvoiceReportList = {
        data: [],
        offset: 0,
        limit: 10,
        total: 0
      }
    },
    resetPayoutReport: (state) => {
      state.payoutReportList = {
        data: [],
        offset: 0,
        limit: 10,
        total: 0
      }
    },
    resetClientDetailsReport: (state) => {
      state.clientDetailsReportList = {
        data: [],
        offset: 0,
        limit: 10,
        total: 0
      }
    },
    resetSessionAttendanceReport: (state) => {
      state.sessionReportList = {
        data: [],
        offset: 0,
        limit: 10,
        total: 0
      }
    },
    resetCoverageReport: (state) => {
      state.coverageReportList = {
        data: [],
        offset: 0,
        limit: 10,
        total: 0
      }
    }
  },
  extraReducers: (builder) => {
    builder

      //**  Get all Reports */
      .addCase(getAllReportsAction.pending, (state) => {
        state.getAllReportsLoading = true
      })
      .addCase(getAllReportsAction.fulfilled, (state, action) => {
        state.getAllReportsLoading = false
        state.getReports = action.payload
        state.error = null
      })
      .addCase(getAllReportsAction.rejected, (state, action) => {
        state.getAllReportsLoading = false
        state.getReports = null
        state.error = action.payload
      })

      //**  Get all Reports */
      .addCase(getClientPaymentAction.pending, (state) => {
        state.getClientPaymentLoading = true
      })
      .addCase(getClientPaymentAction.fulfilled, (state, action) => {
        state.getClientPaymentLoading = false
        state.getClientPayment = action.payload
        state.error = null
      })
      .addCase(getClientPaymentAction.rejected, (state, action) => {
        state.getClientPaymentLoading = false
        state.getClientPayment = null
        state.error = action.payload
      })

      // get All Monthly Income Report
      .addCase(getAllMonthlyIncomeReportsAction.pending, (state) => {
        state.monthlyIncomeReportPending = true
      })
      .addCase(getAllMonthlyIncomeReportsAction.fulfilled, (state, action) => {
        state.monthlyIncomeReportPending = false
        state.monthlyIncomeReportList.data = action.payload.data
        state.monthlyIncomeReportList.offset = action.payload.data.offset
        state.monthlyIncomeReportList.limit = action.payload.data.limit
        state.monthlyIncomeReportList.total = action.payload.data.total
      })
      .addCase(getAllMonthlyIncomeReportsAction.rejected, (state, action) => {
        state.monthlyIncomeReportPending = false
        state.monthlyIncomeReportList = {
          data: [],
          offset: 0,
          limit: 10,
          total: 0
        }
        state.error = action.payload
      })

      // get All Monthly Invoice Reports
      .addCase(getAllMonthlyInvoiceReportsAction.pending, (state) => {
        state.monthlyInvoiceReportPending = true
      })
      .addCase(getAllMonthlyInvoiceReportsAction.fulfilled, (state, action) => {
        state.monthlyInvoiceReportPending = false
        state.monthlyInvoiceReportList.data = action.payload.data
        state.monthlyInvoiceReportList.offset = action.payload.data.offset
        state.monthlyInvoiceReportList.limit = action.payload.data.limit
        state.monthlyInvoiceReportList.total = action.payload.data.total
      })
      .addCase(getAllMonthlyInvoiceReportsAction.rejected, (state, action) => {
        state.monthlyInvoiceReportPending = false
        state.monthlyInvoiceReportList = {
          data: [],
          offset: 0,
          limit: 10,
          total: 0
        }
        state.error = action.payload
      })

      // get All Payout Report
      .addCase(getAllPayoutReportsAction.pending, (state) => {
        state.payoutReportPending = true
      })
      .addCase(getAllPayoutReportsAction.fulfilled, (state, action) => {
        state.payoutReportPending = false
        state.payoutReportList.data = action.payload.data
        state.payoutReportList.offset = action.payload.data.offset
        state.payoutReportList.limit = action.payload.data.limit
        state.payoutReportList.total = action.payload.data.total
      })
      .addCase(getAllPayoutReportsAction.rejected, (state, action) => {
        state.payoutReportPending = false
        state.payoutReportList = {
          data: [],
          offset: 0,
          limit: 10,
          total: 0
        }
        state.error = action.payload
      })

      // get All Client Details Report
      .addCase(getAllMonthlyClientsDetailsAction.pending, (state) => {
        state.clientDetailsReportsPending = true
      })
      .addCase(getAllMonthlyClientsDetailsAction.fulfilled, (state, action) => {
        state.clientDetailsReportsPending = false
        state.clientDetailsReportList.data = action.payload.result
        state.clientDetailsReportList.offset = action.payload.offset
        state.clientDetailsReportList.limit = action.payload.limit
        state.clientDetailsReportList.total = action.payload.count
      })
      .addCase(getAllMonthlyClientsDetailsAction.rejected, (state, action) => {
        state.clientDetailsReportsPending = false
        state.clientDetailsReportList = {
          data: [],
          offset: 0,
          limit: 10,
          total: 0
        }
        state.error = action.payload
      })

      // get All Session Attendance Report
      .addCase(getAllSessionAttendanceAction.pending, (state) => {
        state.sessionAttendanceReport = true
      })
      .addCase(getAllSessionAttendanceAction.fulfilled, (state, action) => {
        state.sessionAttendanceReport = false
        state.sessionReportList.data = action.payload.result
        state.sessionReportList.offset = action.payload.offset
        state.sessionReportList.limit = action.payload.limit
        state.sessionReportList.total = action.payload.count
      })
      .addCase(getAllSessionAttendanceAction.rejected, (state, action) => {
        state.sessionAttendanceReport = false
        state.sessionReportList = {
          data: [],
          offset: 0,
          limit: 10,
          total: 0
        }
        state.error = action.payload
      })

      // get All Coverage Report
      .addCase(getAllCoverageReportsAction.pending, (state) => {
        state.coverageReport = true
      })
      .addCase(getAllCoverageReportsAction.fulfilled, (state, action) => {
        state.coverageReport = false
        state.coverageReportList.data = action.payload.data
        state.coverageReportList.offset = action.payload.data.offset
        state.coverageReportList.limit = action.payload.data.limit
        state.coverageReportList.total = action.payload.data.total
      })
      .addCase(getAllCoverageReportsAction.rejected, (state, action) => {
        state.coverageReport = false
        state.coverageReportList = {
          data: [],
          offset: 0,
          limit: 10,
          total: 0
        }
        state.error = action.payload
      })
  }
})

export const {
  resetMonthlyIncomeReport,
  resetMonthlyInvoiceReport,
  resetPayoutReport,
  resetClientDetailsReport,
  resetSessionAttendanceReport,
  resetCoverageReport
} = ReportsReducer.actions

export default ReportsReducer.reducer

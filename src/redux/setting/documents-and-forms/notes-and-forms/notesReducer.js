/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'
import {
  createTemplateAction,
  GetAllTemplatesAction,
  GetTemplateByIdAction,
  UpdateTemplateAction,
  DeleteTemplatesAction,
  CloningTemplateAction,
  CheckedTemplatesByIdAction
} from './notesAction'

export const NotesAndFormsReducer = createSlice({
  name: 'document',
  initialState: {
    loading: false,
    addTemplatePending: false,
    getTemplatePending: false,
    checkedPending: false,
    deletePending: false,
    updatePending: false,
    deleteSuccess: false,
    cloningPending: false,
    addTemplate: {},
    templates: {},
    getTemplate: {},
    checkedTemplate: {},
    updateTemplate: {},
    clonedTemplate: {},
    error: null
  },
  reducers: {
    resetGetAllTemplates: (state) => {
      state.templates = {}
    },
    resetGetTemplateById: (state) => {
      state.getTemplate = {}
    },
    resetUpdateTemplate: (state) => {
      state.updateTemplate = {}
    },
    resetCheckedTemplate: (state) => {
      state.checkedTemplate = {}
    },
    resetAddTemplate: (state) => {
      state.addTemplate = {}
    },
    resetClonedTemplate: (state) => {
      state.clonedTemplate = {}
    }
  },
  extraReducers: (builder) => {
    builder

      // ** Get All Templates
      .addCase(GetAllTemplatesAction.pending, (state) => {
        state.loading = true
      })
      .addCase(GetAllTemplatesAction.fulfilled, (state, action) => {
        state.loading = false
        state.templates = action.payload
        state.error = null
      })
      .addCase(GetAllTemplatesAction.rejected, (state, action) => {
        state.loading = false
        state.templates = {}
        state.error = action.payload
      })

      // ** Checked Template By id
      .addCase(CheckedTemplatesByIdAction.pending, (state) => {
        state.checkedPending = true
      })
      .addCase(CheckedTemplatesByIdAction.fulfilled, (state, action) => {
        state.checkedPending = false
        state.checkedTemplate = action.payload
      })
      .addCase(CheckedTemplatesByIdAction.rejected, (state, action) => {
        state.checkedPending = false
        state.checkedTemplate = {}
        state.error = action.payload
      })

      // ** Get Template By ID
      .addCase(GetTemplateByIdAction.pending, (state) => {
        state.getTemplatePending = true
      })
      .addCase(GetTemplateByIdAction.fulfilled, (state, action) => {
        state.getTemplatePending = false
        state.getTemplate = action.payload
      })
      .addCase(GetTemplateByIdAction.rejected, (state, action) => {
        state.getTemplatePending = false
        state.getTemplate = {}
        state.error = action.payload
      })

      // ** Delete Template
      .addCase(DeleteTemplatesAction.pending, (state) => {
        state.deletePending = true
        state.deleteSuccess = false
      })
      .addCase(DeleteTemplatesAction.fulfilled, (state) => {
        state.deletePending = false
        state.deleteSuccess = true
      })
      .addCase(DeleteTemplatesAction.rejected, (state, action) => {
        state.deletePending = false
        state.error = action.payload
        state.deleteSuccess = false
      })

      // ** Create Template
      .addCase(createTemplateAction.pending, (state) => {
        state.addTemplatePending = true
      })
      .addCase(createTemplateAction.fulfilled, (state, action) => {
        state.addTemplatePending = false
        state.addTemplate = action.payload
      })
      .addCase(createTemplateAction.rejected, (state, action) => {
        state.addTemplatePending = false
        state.addTemplate = {}
        state.error = action.payload
      })

      // Cloned Template
      .addCase(CloningTemplateAction.pending, (state) => {
        state.cloningPending = true
      })
      .addCase(CloningTemplateAction.fulfilled, (state, action) => {
        state.cloningPending = false
        state.clonedTemplate = action.payload
      })
      .addCase(CloningTemplateAction.rejected, (state, action) => {
        state.cloningPending = false
        state.clonedTemplate = {}
        state.error = action.payload
      })

      // Update Template
      .addCase(UpdateTemplateAction.pending, (state) => {
        state.updatePending = true
      })
      .addCase(UpdateTemplateAction.fulfilled, (state, action) => {
        state.updatePending = false
        state.updateTemplate = action.payload
      })
      .addCase(UpdateTemplateAction.rejected, (state, action) => {
        state.updatePending = false
        state.updateTemplate = {}
        state.error = action.payload
      })
  }
})

export const {
  resetGetTemplateById,
  resetGetAllTemplates,
  resetCheckedTemplate,
  resetClonedTemplate,
  resetUpdateTemplate,
  resetAddTemplate
} = NotesAndFormsReducer.actions
export default NotesAndFormsReducer.reducer

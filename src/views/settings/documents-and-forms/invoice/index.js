/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
// third party libraries
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Form,
  Spinner
} from 'reactstrap'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { Icon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'

// custom component
import FormGroupElement from '@src/components/formGroup/FormGroupElement'
import {
  getInvoiceAction,
  getSuperBillsAction,
  updateInvoiceAction,
  updateSuperBillsAction
} from '../../../../redux/setting/documents-and-forms/notes-and-forms/invoice/invoiceAction'
import CustomSpinner from '../../../../components/spinner/Spinner'
import { getModifiedValues, isObjEmpty } from '../../../../utility/Utils'
import { getProviderProfileAction } from '../../../../redux/setting/management/myProfile/myProfileActions'
import InvoiceModal from '../../../../components/screen.components/settings.component/document/invoice-modal/InvoiceModal'
const CustomCol = ({ children, md = 6, sm = 12, lg = 3 }) => {
  return (
    <Col sm={sm} md={md} lg={lg}>
      {children}
    </Col>
  )
}

const SettingInvoice = () => {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state?.auth)
  const providerId = user?.user_id
  const {
    loading,
    getInvoice,
    getSuperbill,
    superbillPending,
    updateInvoicePending,
    updateSuperbillPending
  } = useSelector((state) => state.settingInvoice)

  //** Get Profile Data */
  const { getProviderProfile } = useSelector((state) => state.providers)

  const [open, setOpen] = useState(false)
  const [updateContent, setUpdateContent] = useState(false)
  const [superBillUpdateContent, setSuperBillUpdateContent] = useState(false)

  const [superBill, setSuperBill] = useState(false)
  const [footerInfo2, setFooterInfo2] = useState('')

  function replaceDate(str) {
    const currentDate = new Date().toLocaleDateString()
    return str?.replace('{{date}}', currentDate)
  }
  function replaceMessage(str) {
    return str?.replace(/{{(\w+)}}/g, (_, match) => {
      const replacements = {
        client_name: 'Issac',
        number_of_invoices: `{number_of_invoices}`,
        provider_name: `${getProviderProfile?.first_name || '--'} ${
          getProviderProfile?.last_name || '--'
        }`,
        provider_email: `${getProviderProfile?.email || '--'}`,
        provider_phone_number: `${getProviderProfile?.phone_number || '--'}`
      }
      return replacements[match] || ''
    })
  }

  const newSubject = replaceDate(getInvoice?.subject)
  const newMessage = replaceMessage(getInvoice?.message)
  const newSuperBillSubject = replaceDate(getSuperbill?.subject)
  const newSuperBillMessage = replaceMessage(getSuperbill?.message)

  const handleOpen = () => {
    setOpen(!open)
  }
  useEffect(() => {
    dispatch(getProviderProfileAction())
    dispatch(getInvoiceAction({ id: providerId }))
    dispatch(getSuperBillsAction({ id: providerId }))
  }, [])

  const updateInvoiceSchema = Yup.object().shape({
    include_logo: Yup.bool(),
    footer_information: Yup.string(),
    email: Yup.string(),
    subject: Yup.string(),
    message: Yup.string()
  })

  const formik = useFormik({
    initialValues: {
      include_logo: getInvoice?.include_logo || false,
      footer_information: getInvoice?.footer_information || '',
      email: getInvoice?.email || '',
      subject: newSubject || '',
      message: newMessage || '',
      messageTemplate: getInvoice?.message || '',
      subjectTemplate: getInvoice?.subject || '',

      superbill_include_logo: getSuperbill?.include_logo || false,
      include_diagnosis_description:
        getSuperbill?.include_diagnosis_description || false,
      include_signature_line: getSuperbill?.include_signature_line || false,
      superbill_footer_information: getSuperbill?.footer_information || '',
      superbill_email: getSuperbill?.email || '',
      superbill_subject: newSuperBillSubject || '',
      superbill_message: newSuperBillMessage || '',
      superbill_messageTemplate: getSuperbill?.message || '',
      superbill_subjectTemplate: getSuperbill?.subject || ''
    },
    validationSchema: updateInvoiceSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      if (isObjEmpty(formik.errors)) {
        const initialData = {
          include_logo: formik.initialValues.include_logo,
          email: formik.initialValues.email,
          footer_information: formik.initialValues.footer_information,
          message: formik.initialValues.messageTemplate,
          subject: formik.initialValues.subjectTemplate
        }
        const initialSuperBillData = {
          include_diagnosis_description:
            formik.initialValues.include_diagnosis_description,
          include_signature_line: formik.initialValues.include_signature_line,
          include_logo: formik.initialValues.superbill_include_logo,
          email: formik.initialValues.superbill_email,
          footer_information: formik.initialValues.superbill_footer_information,
          message: formik.initialValues.superbill_messageTemplate,
          subject: formik.initialValues.superbill_subjectTemplate
        }
        const data = {
          include_logo: values.include_logo,
          email: values.email,
          footer_information: values.footer_information,
          message: values.messageTemplate,
          subject: values.subjectTemplate
        }
        const superbill_data = {
          include_diagnosis_description: values.include_diagnosis_description,
          include_signature_line: values.include_signature_line,
          include_logo: values.superbill_include_logo,
          email: values.superbill_email,
          footer_information: values.superbill_footer_information,
          message: values.superbill_messageTemplate,
          subject: values.superbill_subjectTemplate
        }
        const mdifiedData = getModifiedValues(data, initialData)
        const mdifiedSuperBillData = getModifiedValues(
          superbill_data,
          initialSuperBillData
        )
        if (!isObjEmpty(mdifiedData)) {
          dispatch(
            updateInvoiceAction({
              id: providerId,
              data: mdifiedData
            })
          )
        }
        if (!isObjEmpty(mdifiedSuperBillData)) {
          dispatch(
            updateSuperBillsAction({
              id: providerId,
              data: mdifiedSuperBillData
            })
          )
        }
      }
    }
  })

  const TemplateCard = ({ data, superbill }) => {
    return (
      <>
        <div className="template-card skin-change">
          <div className="head">
            <div className="head-row mb-0_5">
              <span className="head-row-span">From</span>
              <p>{superbill ? data?.superbill_email : data?.email}</p>
            </div>
            <div className="head-row">
              <span className="head-row-span">Subject</span>
              <p>{superbill ? data?.superbill_subject : data?.subject}</p>
            </div>
          </div>
          <hr />
          <div className="head">
            <div className="head-row">
              <span className="head-row-span">Message</span>
              {superbill ? (
                <div
                  dangerouslySetInnerHTML={{ __html: data?.superbill_message }}
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: data?.message }} />
              )}
            </div>
          </div>
        </div>
      </>
    )
  }
  const handleSubmit = ({ values, content, superbill }) => {
    const updatedSubject = replaceDate(values?.subject)
    const updatedMessage = replaceMessage(values?.message)
    const updatedContentMessage = replaceMessage(content)
    if (!superbill) {
      setUpdateContent(content)

      formik.setFieldValue('subject', updatedSubject)
      formik.setFieldValue('message', updatedContentMessage || updatedMessage)
      formik.setFieldValue('messageTemplate', content || getInvoice?.message)
      formik.setFieldValue('subjectTemplate', values?.subject)
    }
    if (superbill) {
      setSuperBillUpdateContent(content)
      formik.setFieldValue('superbill_subject', updatedSubject)
      formik.setFieldValue(
        'superbill_message',
        updatedContentMessage || updatedMessage
      )
      formik.setFieldValue(
        'superbill_messageTemplate',
        content || getSuperbill?.message
      )
      formik.setFieldValue('superbill_subjectTemplate', values?.subject)
    }
  }
  return (
    <div>
      <InvoiceModal
        superbill={superBill}
        open={open}
        handleOpen={handleOpen}
        submit={handleSubmit}
        data={formik?.values}
        messageTemplate={!updateContent ? getInvoice?.message : updateContent}
        superbillMessageTemplate={
          !superBillUpdateContent
            ? getSuperbill?.message
            : superBillUpdateContent
        }
      />
      <Card>
        <div className="p-2 pt-3 bg-yellow">
          <span className="heading-1">Invoice</span>
        </div>
        <CardBody className={loading || superbillPending ? 'm-0 p-0' : 'mx-2'}>
          {loading || superbillPending ? (
            <CustomSpinner />
          ) : (
            <Form onSubmit={formik.handleSubmit}>
              <CustomCol md={8} lg={false}>
                <CardTitle>
                  <h3>Invoices</h3>
                </CardTitle>
                <FormGroupElement
                  type="checkbox"
                  label="Include Logo"
                  inputName="include_logo"
                  labelClassName="pl-10px label-2"
                  formGroupClassName="client_profile--checkbox client_profile--doubleCol__50 mt-3 mb-2"
                  inputClassName="skin-change"
                  checked={formik?.values?.include_logo}
                  {...formik.getFieldProps('include_logo')}
                  formikTouched={formik.touched.include_logo}
                  formikError={formik.errors.include_logo}
                />
                <FormGroupElement
                  type="text"
                  placeholder="Brain"
                  labelClassName="pl-10px"
                  label="Footer Information"
                  inputName="preferredNameClient"
                  inputClassName="radius-25 p-1 skin-change"
                  {...formik.getFieldProps('footer_information')}
                  formikTouched={formik.touched.footer_information}
                  formikError={formik.errors.footer_information}
                />

                <CardTitle className="mt-3 d-flex justify-content-between align-items-center">
                  <h4 className="mx-2">
                    {'Default Invoice Email '}{' '}
                    <Icon icon="clarity:help-solid" width="20" height="20" />
                  </h4>
                  <Button
                    outline
                    size="sm"
                    type="button"
                    onClick={() => {
                      handleOpen()
                      setSuperBill(false)
                    }}
                  >
                    <Icon icon="fa6-solid:pen" width="12" height="12" />
                  </Button>
                </CardTitle>

                <TemplateCard data={formik?.values} superbill={false} />

                <hr />
                <CardTitle className="my-3">
                  <h3>Superbills</h3>
                </CardTitle>

                <FormGroupElement
                  type="checkbox"
                  label="Include Logo"
                  inputName="superbill_include_logo"
                  labelClassName="pl-10px label-2"
                  formGroupClassName="client_profile--checkbox client_profile--doubleCol__50"
                  inputClassName="skin-change"
                  checked={formik?.values?.superbill_include_logo}
                  {...formik.getFieldProps('superbill_include_logo')}
                  formikTouched={formik.touched.superbill_include_logo}
                  formikError={formik.errors.superbill_include_logo}
                />
                <FormGroupElement
                  type="checkbox"
                  label="Include Signature Line"
                  inputName="include_signature_line"
                  labelClassName="pl-10px label-2"
                  formGroupClassName="client_profile--checkbox client_profile--doubleCol__50"
                  inputClassName="skin-change"
                  checked={formik?.values?.include_signature_line}
                  {...formik.getFieldProps('include_signature_line')}
                  formikTouched={formik.touched.include_signature_line}
                  formikError={formik.errors.include_signature_line}
                />
                <FormGroupElement
                  type="checkbox"
                  label="Include Diagnosis Description"
                  inputName="include_diagnosis_description"
                  labelClassName="pl-10px label-2"
                  formGroupClassName="client_profile--checkbox client_profile--doubleCol__50"
                  inputClassName="skin-change"
                  checked={formik?.values?.include_diagnosis_description}
                  {...formik.getFieldProps('include_diagnosis_description')}
                  formikTouched={formik.touched.include_diagnosis_description}
                  formikError={formik.errors.include_diagnosis_description}
                />
                <FormGroupElement
                  type="text"
                  label="Footer Information"
                  placeholder="Footer Information"
                  labelClassName="pl-10px mt-2 label-2"
                  inputName="superbill_footer_information"
                  inputClassName="form-fields radius-25 skin-change p-1"
                  {...formik.getFieldProps('superbill_footer_information')}
                  formikTouched={formik.touched.superbill_footer_information}
                  formikError={formik.errors.superbill_footer_information}
                />
                <CardTitle className="mt-3 d-flex justify-content-between align-items-center">
                  <h4 className="mx-2">
                    {'Default Superbill Email '}
                    <Icon icon="clarity:help-solid" width="20" height="20" />
                  </h4>
                  <Button
                    outline
                    size="sm"
                    type="button"
                    onClick={() => {
                      handleOpen()
                      setSuperBill(true)
                    }}
                  >
                    <Icon icon="fa6-solid:pen" width="12" height="12" />
                  </Button>
                </CardTitle>
                <TemplateCard data={formik?.values} superbill={true} />

                <div className="d-flex justify-content-end align-items-center mt-2">
                  <Button
                    className="button-cancel pd me-1"
                    type="button"
                    onClick={() => formik.handleReset()}
                  >
                    Cancel
                  </Button>

                  <Button
                    className="button-success pd"
                    type="submit"
                    disabled={updateInvoicePending || updateSuperbillPending}
                  >
                    {updateInvoicePending || updateSuperbillPending ? (
                      <Spinner size="sm" />
                    ) : (
                      <Icon icon="akar-icons:check" width="14" height="14" />
                    )}
                    <span className="mx-1">Save</span>
                  </Button>
                </div>
              </CustomCol>
            </Form>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

export default SettingInvoice

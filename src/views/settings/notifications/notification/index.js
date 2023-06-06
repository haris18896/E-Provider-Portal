/* eslint-disable no-unused-vars */
import { Fragment, useEffect, useState } from 'react'
// third party
import {
  Card,
  CardBody,
  CardFooter,
  Row,
  Col,
  Button,
  Form,
  Spinner
} from 'reactstrap'
// components
import FormGroupElement from '@FormGroupElement'
import { Check } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import {
  getNotification,
  updateNotification,
  getReminderAction,
  updateReminderAction
} from '../../../../redux/notification/notificationAction'
import { FormikProvider, useFormik } from 'formik'
import { isObjEmpty, getModifiedValues } from '@utils'
import {
  clientNotesOptions,
  notificationsOptions,
  notificationValidationSchema,
  reminderOptions
} from './constant'
import CustomSpinner from '../../../../components/spinner/Spinner'

const SettingNotifications = () => {
  const dispatch = useDispatch()

  const {
    getNotificationDetail,
    loading,
    getReminderDetail,
    updateNotificationloading,
    updateReminderLoading
  } = useSelector((state) => state.notification)
  useEffect(() => {
    dispatch(getNotification())
    dispatch(getReminderAction())
  }, [])

  const [reminder, setReminder] = useState(1)
  const [reminderNotes, setReminderNotes] = useState(1)

  const formik = useFormik({
    initialValues: {
      client_messages: getNotificationDetail?.client_messages || false,
      payment_received: getNotificationDetail?.payment_received || false,
      payment_overdue: getNotificationDetail?.payment_overdue || false,
      client_check_in: getNotificationDetail?.client_check_in || false,
      software_updates: getNotificationDetail?.software_updates || false,
      appointment_type: getReminderDetail?.appointment_type,
      client_notes_type: getReminderDetail?.client_notes_type
    },
    validationSchema: notificationValidationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (isObjEmpty(formik.errors)) {
        const InitialNotificationData = {
          client_check_in: formik.initialValues.client_check_in,
          client_messages: formik.initialValues.client_messages,
          payment_overdue: formik.initialValues.payment_overdue,
          payment_received: formik.initialValues.payment_received,
          software_updates: formik.initialValues.software_updates
        }
        const data = {
          client_check_in: values.client_check_in,
          client_messages: values.client_messages,
          payment_overdue: values.payment_overdue,
          payment_received: values.payment_received,
          software_updates: values.software_updates
        }
        const initialReminderData = {
          appointment_type: formik.initialValues.appointment_type,
          client_notes_type: formik.initialValues.client_notes_type
        }

        const reminderData = {
          appointment_type: values.appointment_type,
          client_notes_type: values.client_notes_type
        }
        const modifiedData = getModifiedValues(data, InitialNotificationData)
        const modifiedReminderData = getModifiedValues(
          reminderData,
          initialReminderData
        )

        const checkModifiedData = isObjEmpty(modifiedData)
        const checkModifiedReminderData = isObjEmpty(modifiedReminderData)
        if (!checkModifiedReminderData) {
          dispatch(
            updateReminderAction({
              data: reminderData
            })
          )
        }

        if (!checkModifiedData) {
          dispatch(updateNotification({ data }))
        }
      }
    }
  })
  

  return (
    <div>
      <FormikProvider value={formik}>
        <Form onSubmit={formik.handleSubmit}>
          <Card className="settings">
            <div className="p-2 pt-3 bg-yellow">
              <span className="heading-1">Notifications</span>
            </div>
            {loading ? (
              <CustomSpinner />
            ) : (
              <>
                <CardBody>
                  <span className="sub-heading-1">Notifications</span>
                  <div className="mt-1">
                    {notificationsOptions.map((item, index) => (
                      <Fragment key={index}>
                        <FormGroupElement
                          inputType="checkbox"
                          disabled={loading}
                          inputName={item.name}
                          label={item.label}
                          labelClassName="pl-10px"
                          formGroupClassName="client_profile--checkbox client_profile--doubleCol__50"
                          inputClassName="skin-change"
                          value={formik.values[`${item.value}`]}
                          checked={formik.values[`${item.name}`]}
                          {...formik.getFieldProps(`${item.name}`)}
                        />
                      </Fragment>
                    ))}
                  </div>
                </CardBody>
                <hr />

                <CardBody>
                  <span className="sub-heading-1">Reminders</span>
                  <Row className="mt-1 width-check">
                    <Col sm={12} md={6}>
                      <span className="heading-5">Appointment reminder</span>
                      <div className="mt-1">
                        {reminderOptions.map((item, index) => {
                          return (
                            <Fragment key={index}>
                              <FormGroupElement
                                inputType="radio"
                                inputName={item.label}
                                label={item.label}
                                labelClassName="pl-10px"
                                formGroupClassName="client_profile--checkbox client_profile--doubleCol__50"
                                inputClassName="skin-change"
                                value={formik.values.appointment_type}
                                checked={
                                  formik.values.appointment_type === item.value
                                }
                                onChange={() =>
                                  formik.setFieldValue(
                                    `appointment_type`,
                                    item.value
                                  )
                                }
                              />
                            </Fragment>
                          )
                        })}
                      </div>
                    </Col>
                    <Col sm={12} md={6}>
                      <span className="heading-5">Client notes reminder</span>
                      <div className="mt-1">
                        {clientNotesOptions.map((item, index) => (
                          <Fragment key={index}>
                            <FormGroupElement
                              inputType="radio"
                              inputName={item.name}
                              label={item.label}
                              labelClassName="pl-10px"
                              formGroupClassName="client_profile--checkbox client_profile--doubleCol__50"
                              inputClassName="skin-change"
                              value={formik.values.client_check_in}
                              checked={
                                formik.values.client_notes_type === item.value
                              }
                              onChange={() =>
                                formik.setFieldValue(
                                  `client_notes_type`,
                                  item.value
                                )
                              }
                            />
                          </Fragment>
                        ))}
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter className="settings--footer">
                  <Button className="button-cancel me-1">Cancel</Button>
                  <Button
                    disabled={
                      updateReminderLoading || updateNotificationloading
                    }
                    className="button-success"
                    onClick={() => formik.handleSubmit()}
                  >
                    {updateReminderLoading || updateNotificationloading ? (
                      <Spinner size="sm" />
                    ) : (
                      <Check size={15} />
                    )}
                    <span className="px-1">Save</span>
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        </Form>
      </FormikProvider>
    </div>
  )
}

export default SettingNotifications

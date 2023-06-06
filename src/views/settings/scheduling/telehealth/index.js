/* eslint-disable no-unused-vars */
import React, { Fragment, useEffect } from 'react'
// Third Party
import classNames from 'classnames'
import { Check, Edit2 } from 'react-feather'
import { Button, Card, CardBody, Col, Form, Spinner } from 'reactstrap'
import { isObjEmpty, getModifiedValues } from '@utils'
// components
import FormGroupElement from '@FormGroupElement'
// icons
import doxy from '@src/assets/images/icons/doxy.png'
import phone from '@src/assets/images/icons/phoneCall.svg'
import check from '@src/assets/images/icons/whitecheck.svg'
import zoom from '@src/assets/images/icons/zoomFill.svg'
import googleMeet from '@src/assets/images/icons/googleMeet.svg'
import GoogleLogin, { GoogleLogout } from 'react-google-login'
import { gapi } from 'gapi-script'
import { FormikProvider, useFormik } from 'formik'
import {
  getReminderAction,
  updateReminderAction
} from '../../../../redux/notification/notificationAction'
import { useDispatch, useSelector } from 'react-redux'

const SettingTeleHealth = () => {
  const dispatch = useDispatch()
  const { getReminderDetail, updateReminderLoading } = useSelector(
    (state) => state.notification
  )
  const clientId =
    '209828197471-nlb0el7092u53q23dilid0grp61dqtdt.apps.googleusercontent.com'
  const telehealthOptions = [
    {
      label: '48 hours before',
      value: 1
    },
    {
      label: '24 hours before',
      value: 2
    },
    {
      label: '1 hour before',
      value: 3
    },
    {
      label: '5 minutes before',
      value: 4
    },
    {
      label: 'Session start time',
      value: 5
    }
  ]

  const telehealthConnections = [
    {
      icon: zoom,
      title: 'Zoom',
      connected: check,
      username: 'etheraIsaac',
      edit: <Edit2 size={15} />
    },
    {
      icon: googleMeet,
      title: 'Google Meet',
      connected: '',
      username: '',
      edit: <Edit2 size={15} />
    },
    {
      icon: doxy,
      title: 'Doxy.me',
      connected: '',
      username: '',
      edit: <Edit2 size={15} />
    }
  ]
  useEffect(() => {
    dispatch(getReminderAction())
  }, [])
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId,
        scope: ''
      })
    }
    gapi.load('client:auth2', start)
  })

  const formik = useFormik({
    initialValues: {
      telehealth_type: getReminderDetail?.telehealth_type
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      if (isObjEmpty(formik.errors)) {
        const initialReminderData = {
          telehealth_type: formik.initialValues.telehealth_type
        }

        const reminderData = {
          telehealth_type: values.telehealth_type
        }
        const modifiedReminderData = getModifiedValues(
          reminderData,
          initialReminderData
        )

        const checkModifiedReminderData = isObjEmpty(modifiedReminderData)
        if (!checkModifiedReminderData) {
          dispatch(
            updateReminderAction({
              data: reminderData
            })
          )
        }
      }
    }
  })
  return (
    <div>
      <Card>
        <div className="p-2 pt-3 bg-yellow">
          <span className="heading-1">TeleHealth</span>
        </div>

        <CardBody className="px-2">
          <FormikProvider value={formik}>
            <Form onSubmit={formik.handleSubmit}>
              <p className="sub-heading-1 mb-1">Reminder</p>
              <span className="sub-heading-2 f-bold">
                Send email reminders with link
              </span>
              <div className="mt-1">
                {telehealthOptions.map((item, index) => {
                  return (
                    <Fragment key={index}>
                      <FormGroupElement
                        inputType="radio"
                        inputName={item.label}
                        label={item.label}
                        labelClassName="pl-10px"
                        formGroupClassName="client_profile--checkbox client_profile--doubleCol__50"
                        inputClassName="skin-change"
                        value={formik.values.telehealth_type}
                        checked={formik.values.telehealth_type === item.value}
                        onChange={() =>
                          formik.setFieldValue(`telehealth_type`, item.value)
                        }
                      />
                    </Fragment>
                  )
                  // <Fragment key={index}>
                  //   <FormGroupElement
                  //     inputType="radio"
                  //     inputName={item?.value || 'notes none'}
                  //     label={item.label}
                  //     labelClassName="pl-10px"
                  //     formGroupClassName="pl-10px client_profile--checkbox client_profile--doubleCol__50"
                  //     inputClassName="skin-change"
                  //     value={item.value}
                  //     checked={item.value === reminder}
                  //     onChange={(e) => setReminder(e.target.value)}
                  //   />
                  // </Fragment>
                })}
              </div>
              <Button type="submit" size="sm" className="button-success mt-2" disabled={updateReminderLoading}>
                <span>
                  {updateReminderLoading ? (
                    <Spinner size="sm" />
                  ) : (
                    <Check className='check-size' />
                  )}
                </span>
                <span className="px-1">Save</span>
              </Button>
            </Form>
          </FormikProvider>
        </CardBody>

        {/*<hr />*/}
        {/*<span className="sub-heading-1 pl-20px">Telehealth Platform</span>*/}

        {/*{telehealthConnections.map((item, index) => (*/}
        {/*  <Col md={8} lg={7} key={index}>*/}
        {/*    <div className="tele-provider dark-color">*/}
        {/*      <div*/}
        {/*        className={classNames({*/}
        {/*          source: true,*/}
        {/*          'flex-1': false,*/}
        {/*          'flex-03': true*/}
        {/*        })}*/}
        {/*      >*/}
        {/*        <img src={item.icon} alt="Google meet" />*/}
        {/*        <p>*/}
        {/*          <strong>{item.title}</strong>*/}
        {/*        </p>*/}
        {/*      </div>*/}
        {/*      <div className="source-detail">*/}
        {/*        {item.connected ? (*/}
        {/*          <>*/}
        {/*            <div className="source-status">*/}
        {/*              <img src={check} alt="check" />*/}
        {/*              <p>*/}
        {/*                <strong>Connected</strong> with username{' '}*/}
        {/*                <strong>etheraisaac</strong>*/}
        {/*              </p>*/}
        {/*            </div>*/}
        {/*          </>*/}
        {/*        ) : (*/}
        {/*          <>*/}
        {/*            <div className="source-status">*/}
        {/*              <div className="source-status--not_connected skin-change">*/}
        {/*                <span className="f-bold">*/}
        {/*                  <GoogleLogin*/}
        {/*                    icon={false}*/}
        {/*                    className="connect-button"*/}
        {/*                    clientId={clientId}*/}
        {/*                    buttonText=" Connect Account"*/}
        {/*                    onSuccess={onSuccess}*/}
        {/*                    onFailure={onFailure}*/}
        {/*                    cookiePolicy={'single_host_origin'}*/}
        {/*                    isSignedIn={true}*/}
        {/*                  />*/}
        {/*                </span>*/}
        {/*                <br />*/}
        {/*                <span className="f-bold">*/}
        {/*                  <GoogleLogout*/}
        {/*                    icon={false}*/}
        {/*                    className="connect-button"*/}
        {/*                    clientId={clientId}*/}
        {/*                    buttonText=" logout"*/}
        {/*                    onLogoutSuccess={onLogoutSuccess}*/}
        {/*                  />*/}
        {/*                  /!* <a href='https://apps.google.com/meet/' target="_blank"> *!/*/}

        {/*                  /!* </a> *!/*/}
        {/*                </span>*/}
        {/*              </div>*/}
        {/*            </div>*/}
        {/*          </>*/}
        {/*        )}*/}

        {/*        <div className="edit-button skin-change">*/}
        {/*          <Edit2 size={15} />*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </Col>*/}
        {/*))}*/}

        {/*<Col md={3} lg={3}>*/}
        {/*  <div className="tele-provider dark-color">*/}
        {/*    <div*/}
        {/*      className={classNames({*/}
        {/*        source: true,*/}
        {/*        'flex-1': true,*/}
        {/*        'border-none': true*/}
        {/*      })}*/}
        {/*    >*/}
        {/*      <img src={phone} alt="Google meet" />*/}
        {/*      <p>*/}
        {/*        <strong>714-555-1234</strong>*/}
        {/*      </p>*/}
        {/*    </div>*/}
        {/*    <div className="edit-button skin-change mx-1">*/}
        {/*      <Edit2 size={15} />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</Col>*/}
      </Card>
    </div>
  )
}

export default SettingTeleHealth

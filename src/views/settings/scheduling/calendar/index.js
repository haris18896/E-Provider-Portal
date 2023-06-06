/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
// Third party pkg
import * as Yup from 'yup'
import moment from 'moment'
import Flatpickr from 'react-flatpickr'
import { useFormik } from 'formik'
import { Icon } from '@iconify/react'
import * as RouterLink from 'react-router-dom'
import {
  Button,
  Card,
  Col,
  Row,
  Form,
  Label,
  FormGroup,
  Input,
  Spinner
} from 'reactstrap'
import {
  endTimeGreaterThanStartTime,
  isObjEmpty,
  timeFormat
} from '../../../../utility/Utils'
import CustomSpinner from '../../../../components/spinner/Spinner'
// components
import Head from '@customComponents/head'
import FormGroupElement from '@FormGroupElement'
import iosCal from '@src/assets/images/icons/calendar.png'
import { useDispatch, useSelector } from 'react-redux'
import {
  getProviderCalendarAction,
  updateProviderCalendarAction
} from '../../../../redux/setting/scheduling/calendar/providerCalendarAction'
import classNames from 'classnames'

const CustomCol = ({ children, md = 6, sm = 12, lg = 3, className }) => {
  return (
    <Col sm={sm} md={md} lg={lg} className={className}>
      {children}
    </Col>
  )
}

const SettingCalendar = () => {
  const dispatch = useDispatch()
  const { getProviderCalendar, updateLoading, loading } = useSelector(
    (state) => state.providerCalendar
  )
  useEffect(() => {
    dispatch(getProviderCalendarAction())
  }, [])
  const settingsCalendarSchema = Yup.object().shape({
    start_time: timeFormat('start_time').required(),
    end_time: timeFormat('end_time')
      .required()
      .concat(endTimeGreaterThanStartTime('start_time', 'end_time')),
    calendarUrl: Yup.string().url(),
    calendar_sync: Yup.boolean()
  })

  // ** formik
  const formik = useFormik({
    initialValues: {
      start_time: getProviderCalendar?.start_time || '07:00 AM',
      end_time: getProviderCalendar?.end_time || '11:00 PM',
      calendarUrl: 'https://loremipsumdolorsitamet.com/12345667/abcd',
      calendar_sync: getProviderCalendar?.calendar_sync || false
    },
    enableReinitialize: true,
    validationSchema: settingsCalendarSchema,
    onSubmit: (values) => {
      if (isObjEmpty(formik.errors)) {
        const data = {
          start_time: values.start_time,
          end_time: values.end_time,
          // calendarUrl: values.calendarUrl,
          calendar_sync: values.calendar_sync
        }

        dispatch(updateProviderCalendarAction({ data }))
      }
    }
  })

  const calendar = [
    {
      title: '1-Way Sync',
      name: 'Google Calendar',
      icon: <Icon icon="logos:google-calendar" width="30" height="30" />,
      details:
        '1-Way Sync allow you to view your Ethera appointments in an external calender. All changes to your client appointments must be made directly in Ethera Dashboard',
      urlTitle: 'Calendar URL',
      url: 'https://loremipsumdolorsitamet.com/12345667/abcd',
      help: 'Need Help? Read our',
      instruction: 'Simple set up instruction for Google Calender'
    },
    {
      title: '1-Way Sync',
      name: 'iCal',
      icon: <img src={iosCal} alt="ios Cal" />,
      details:
        '1-Way Sync allow you to view your Ethera appointments in an external calender. All changes to your client appointments must be made directly in Ethera Dashboard',
      urlTitle: 'Calendar URL',
      url: 'https://loremipsumdolorsitamet.com/12345667/abcd',
      help: 'Need Help? Read our',
      instruction: 'Simple set up instruction for Google Calender'
    }
  ]

  return (
    <Card>
      <Head paddingBottom>
        <div className="px-3">
          <span className="heading-1">Calendar Settings</span>
          <p className="mt-2 pb-1">Calender Display</p>
        </div>
      </Head>
      <Form onSubmit={formik.handleSubmit}>
        {loading ? (
          <CustomSpinner />
        ) : (
          <>
            <div className="px-2">
              <div className="pt-2 calendar--time">
                <div>
                  <label className="pl-10px">Start Time</label>
                  <Flatpickr
                    data-enable-time
                    id="start_time"
                    name="start_time"
                    type="time"
                    className={classNames({
                      'radius-25 bg-white form-control skin-change': true,
                      invalid: !!formik.errors.start_time
                    })}
                    value={formik.values.start_time}
                    onChange={(time) =>
                      formik.setFieldValue(
                        'start_time',
                        moment(time[0]).format('HH:mm:ss')
                      )
                    }
                    options={{
                      mode: 'single',
                      minuteIncrement: 15,
                      enableTime: true,
                      noCalendar: true,
                      dateFormat: 'h:i K'
                    }}
                  />
                </div>

                <span className="px-2 mt-2 f-bold">to</span>

                <div>
                  <label className="pl-10px">End Time</label>
                  <Flatpickr
                    data-enable-time
                    id="end_time"
                    name="end_time"
                    type="time"
                    className={classNames({
                      'radius-25 bg-white form-control skin-change': true,
                      invalid: !!formik.errors.end_time
                    })}
                    value={formik.values.end_time}
                    onChange={(time) =>
                      formik.setFieldValue(
                        'end_time',
                        moment(time[0]).format('HH:mm:ss')
                      )
                    }
                    options={{
                      mode: 'single',
                      minuteIncrement: 15,
                      enableTime: true,
                      noCalendar: true,
                      dateFormat: 'h:i K'
                    }}
                  />
                </div>
              </div>
            </div>
            {/*<hr />*/}
            {/*<div className="px-2 calendar--sync">*/}
            {/*  <p className="sub-heading-1">Calendar Sync</p>*/}
            {/*  <div className="d-flex align-items-center justify-content-start mt-1">*/}
            {/*    <Input*/}
            {/*      type="checkbox"*/}
            {/*      name="calendar_sync"*/}
            {/*      id="switch"*/}
            {/*      className="switch"*/}
            {/*      checked={formik.values.calendar_sync === true}*/}
            {/*      {...formik.getFieldProps('calendar_sync')}*/}
            {/*    />*/}
            {/*    <label for="switch" className="switch-label"></label>*/}
            {/*    <span htmlFor="switch-secondary" className="pl-10px">*/}
            {/*      Client names will display as initials in your Calendar sync*/}
            {/*    </span>*/}
            {/*  </div>*/}
            {/*</div>*/}
            {/*<hr />*/}
            <div>
              {/*<div className="calender-card--main">*/}
              {/*  {calendar.map((item, index) => (*/}
              {/*    <div key={index} className="calender-card">*/}
              {/*      <div className="icon-section px-3 skin-change">*/}
              {/*        <h3>*/}
              {/*          <strong>{item.title}</strong>*/}
              {/*        </h3>*/}
              {/*        <p>{item.name}</p>*/}
              {/*        {item.icon}*/}
              {/*      </div>*/}
              {/*      <div className="data-section">*/}
              {/*        <p>{item.details}</p>*/}
              {/*        <div className="link-section mt-2">*/}
              {/*          <FormGroupElement*/}
              {/*            label={item.urlTitle}*/}
              {/*            inputName={item.name}*/}
              {/*            inputType="text"*/}
              {/*            labelClassName="pl-10px"*/}
              {/*            labelExtraClasses="f-bold sub-heading-2"*/}
              {/*            inputClassName="form-fields radius-25 skin-change"*/}
              {/*            formGroupClassName={'flex-1 mb-0 link-input'}*/}
              {/*            {...formik.getFieldProps('calendarUrl')}*/}
              {/*            formikTouched={formik.touched.calendarUrl}*/}
              {/*            formikError={formik.errors.calendarUrl}*/}
              {/*          />*/}
              {/*          <Button>*/}
              {/*            <Icon icon="bx:link" width="20" height="20" /> Copy*/}
              {/*            Link*/}
              {/*          </Button>*/}
              {/*        </div>*/}
              {/*        <p>*/}
              {/*          {item.help}{' '}*/}
              {/*          <RouterLink.Link to="#">*/}
              {/*            <u>{item.instruction}</u>*/}
              {/*          </RouterLink.Link>*/}
              {/*        </p>*/}
              {/*      </div>*/}
              {/*    </div>*/}
              {/*  ))}*/}
              {/*</div>*/}
            </div>
            <hr />
            <div className="px-3 pb-2">
              <Button className="button-success radius-25" type="submit">
                {updateLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <Icon icon="akar-icons:check" />
                )}
                <span className="mx-1">Save</span>
              </Button>
            </div>
          </>
        )}
      </Form>
    </Card>
  )
}

export default SettingCalendar

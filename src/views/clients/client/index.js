/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
// hooks
import useMediaQuery from '@hooks/useMediaQuery'

//third party
import classNames from 'classnames'
import {
  Col,
  Row,
  List,
  Card,
  Button,
  CardBody,
  PopoverBody,
  UncontrolledPopover
} from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { Calendar, CheckSquare, Edit2, MessageCircle } from 'react-feather'

// components
import Spinner from '@spinner'
import SelectField from '@select'
import ClientOverView from './client-overview'
import ClientBillingList from './client-billing'
import { clientStatusObj } from '../../../components/screen.components/clients.screen/FormConstants'
import MessageModal from '@ScreenComponent/clients.screen/message-modal'
import ClientForm from '@ScreenComponent/clients.screen/FormConstants/ClientForm'
import { getModifiedValues, isObjEmpty } from '../../../utility/Utils'

// ** Store && Actions
import { useDispatch, useSelector } from 'react-redux'
import {
  getClientAction,
  updateClientAction,
  getClientNotesAction,
  getClientAppointmentsAction,
  getClientInvoiceAction
} from '../../../redux/client/clientAction'

import {
  resetGetClient,
  resetClientNotes,
  resetClientAppointments,
  resetClientBilling
} from '../../../redux/client/clientSlice'

import { getAllServiceAction } from '../../../redux/setting/billing/service/serviceAction'
import moment from 'moment'

const statuses = [
  {
    text: 'Paid',
    value: 0
  },
  {
    text: 'Unpaid',
    value: 1
  },
  {
    text: 'Void',
    value: 2
  }
]
const ClientProfile = () => {
  const { id } = useParams()
  const idx = id
  const path = window.location.search
  const setPath = path.slice(1)

  // ** States
  const [status, setStatus] = useState(null)
  const [tab, setTab] = useState(
    setPath === 'overview'
      ? 'overview'
      : setPath === 'billing'
      ? 'billing'
      : setPath === 'profile'
      ? 'profile'
      : 'overview'
  )
  const [messageModal, setMessageModal] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const tablet = useMediaQuery('(min-width: 768px)')
  const small = useMediaQuery('(min-width: 800px)')
  const handleTabChange = (tab) => {
    if (tab === 'profile') {
      dispatch(
        getClientAction({
          id
        })
      )
    }
    const queryParams = tab
    const currentUrl = `/clients/client/${id}`
    const newUrl = currentUrl.includes('?')
      ? `${currentUrl}&${queryParams}`
      : `${currentUrl}?${queryParams}`
    window.history.pushState({}, '', newUrl)
  }
  useEffect(() => {
    if (!!setPath) {
      setTab(setPath)
    }
  }, [])
  useEffect(() => {
    if (id) {
      dispatch(
        getClientInvoiceAction({
          id
        })
      )
      if (id && setPath === 'profile') {
        dispatch(
          getClientAction({
            id
          })
        )
      }
    }

    return () => {
      dispatch(resetClientAppointments())
      // dispatch(resetGetClient())
      dispatch(resetClientNotes())
    }
  }, [id])

  const onChangeHandler = (name, value) => {
    if (name === 'status') setStatus(value)
  }

  const {
    loading,
    getClient,
    deleteLoading,
    updateLoading,
    getClientInvoice,
    getAllServiceLoading,
    getClientInvoiceLoading,
    clientAppointmentsPending
  } = useSelector((state) => state.client)
  const listOfServices = getClient?.client_service.map((item) => ({
    is_default: item?.is_default,
    code: item?.service?.code,
    fee: item?.fees,
    id: item?.service?.id,
    provider: item?.service?.provider,
    service: item?.service?.service,
    time: item?.service?.time
  }))
  const defaultServiceIdList = listOfServices?.map((item) => ({
    id: item.id
  }))

  const initialValues = () => {
    return {
      first_name: getClient?.first_name || '',
      middle_name: getClient?.middle_name || '',
      last_name: getClient?.last_name || '',
      suffix: getClient?.suffix || '',
      preferred_name: getClient?.preferred_name || '',
      is_minor: getClient?.is_minor || '',
      status: getClient?.status || 1,
      messaging: getClient?.messaging || 1,
      client_guardian: getClient?.client_guardian || [
        {
          status: '1',
          first_name: '',
          last_name: '',
          phone_number: '',
          email: '',
          addresses: {
            address: '',
            city: '',
            state: '',
            zipcode: ''
          }
        }
      ],
      phone_number: getClient?.phone_number || '',
      email: getClient?.email || '',
      // emailReminder: [],
      addresses: [
        {
          address: getClient?.client_address[0]?.address || '',
          city: getClient?.client_address[0]?.city || '',
          state: getClient?.client_address[0]?.state || '',
          zipcode: getClient?.client_address[0]?.zipcode || ''
        },
        {
          address: getClient?.client_address[1]?.address || '',
          city: getClient?.client_address[1]?.city || '',
          state: getClient?.client_address[1]?.state || '',
          zipcode: getClient?.client_address[1]?.zipcode || ''
        }
      ],
      date_of_birth: getClient?.date_of_birth || '',
      gender: getClient?.gender || '',
      gender_identity: getClient?.gender_identity || '',
      relationship_status: getClient?.relationship_status || '',
      employment_status: getClient?.employment_status || '',
      race: getClient?.race || '',
      ethnicity: getClient?.ethnicity || '',
      preferred_language: getClient?.preferred_language || '',
      note: getClient?.note || '',
      date_started: getClient?.date_started || ``,
      referred_by: getClient?.referred_by || '',
      billing_type: getClient?.billing_type || '1',
      // autoBillingDocument: [],
      emailBillingNotification: 'None',
      insurance_type: getClient?.client_insurance[0]?.insurance_type || 1,
      primary_insured: getClient?.client_insurance[0]?.primary_insured || 1,
      insurancePayer: getClient?.client_insurance[0]?.insurance_payer || '',
      member_id: getClient?.client_insurance[0]?.member_id || '',
      plan_id: getClient?.client_insurance[0]?.plan_id || '',
      group_id: getClient?.client_insurance[0]?.group_id || '',
      coinsurance: getClient?.client_insurance[0]?.coinsurance || '',
      superBillsPayment: 'Client',
      deductible: getClient?.client_insurance[0]?.deductible || '',
      payer_phone_number:
        getClient?.client_insurance[0]?.payer_phone_number || '',
      payer_fax: getClient?.client_insurance[0]?.payer_fax || '',
      employer: getClient?.client_insurance[0]?.employer || '',
      authorization_number:
        getClient?.client_authorization[0]?.authorization_number || '',
      validity: getClient?.client_authorization[0]?.validity || '',
      number_of_uses: getClient?.client_authorization[0]?.number_of_uses || '',
      reminding_before_expire:
        getClient?.client_authorization[0]?.reminding_before_expire || '',
      is_active: getClient?.client_authorization[0]?.is_active || '',
      insuranceClaim: false,
      clientServices: listOfServices || [],
      serviceList: '',
      // eslint-disable-next-line no-unneeded-ternary
      defaultService: defaultServiceIdList || []
    }
  }
  const initials = initialValues()
  function cleanNullKeyPair(obj) {
    for (const propName in obj) {
      if (
        obj[propName] === null ||
        obj[propName] === undefined ||
        obj[propName] === '' ||
        obj[propName] === []
      ) {
        delete obj[propName]
      }
    }
    return obj
  }

  const handleSubmit = ({ values, image }) => {
    const data = {
      ...values,
      services: values.clientServices.map((item) => {
        return {
          service: item?.id,
          fees: item?.fee,
          // eslint-disable-next-line no-unneeded-ternary
          is_default:
            values.defaultService.includes(item.id) || item.is_default === true
        }
      }),
      client_insurance: {
        insurance_type: values.insurance_type,
        primary_insured: values.primary_insured,
        insurance_payer: values.insurance_payer,
        member_id: values.member_id,
        plan_id: values.plan_id,
        group_id: values.group_id,
        coinsurance: values.coinsurance,
        superBillsPayment: values.superBillsPayment,
        deductible: values.deductible,
        payer_phone_number: values.payer_phone_number,
        payer_fax: values.payer_fax,
        employer: values.employer
      },
      authorization_tracking: {
        authorization_number: values.authorization_number,
        is_active: values.is_active,
        number_of_uses: values.number_of_uses,
        reminding_before_expire: values.reminding_before_expire,
        validity: values.validity
      }
    }
    let imageData = null
    if (image) {
      imageData = new FormData()
      imageData.append('image', image)
    }

    const modifiedInsurance = getModifiedValues(data.client_insurance, initials)
    const modifiedAuthorization = getModifiedValues(
      data.authorization_tracking,
      initials
    )

    const checkObjInsurance = isObjEmpty(modifiedInsurance)
    const checkObjAuthorization = isObjEmpty(modifiedAuthorization)

    const newData = {
      ...values,

      client_insurance:
        checkObjInsurance === true ? null : data.client_insurance,

      authorization_tracking:
        checkObjAuthorization === true ? null : data.authorization_tracking,
      clientServices: values.clientServices?.length === 0 ? null : null,
      defaultService: values.defaultService?.length === 0 ? null : null,
      services: data.services?.length === 0 ? null : data?.services
    }

    const modifiedData = getModifiedValues(newData, initials)
    const latest_data = cleanNullKeyPair(modifiedData)

    dispatch(
      updateClientAction({
        id,
        data: latest_data,
        img: imageData,
        navigate
      })
    )
  }
  return (
    <div>
      <Card className="Client-overView relative">
        <Row className="pt-3 pe-2 align-items-center justify-space-between bg-yellow">
          <Col sm={12} md={5} className="ml-1 ">
            {getClientInvoiceLoading ? null : (
              <div className="Client-overView--Name_status">
                <span className="heading-1">
                  {getClientInvoice?.first_name} {getClientInvoice?.last_name}
                </span>

                <div
                  className={classNames({
                    // 'DOT DOT--green ml-1': true
                    'DOT DOT--green': getClientInvoice?.status === '1',
                    'DOT DOT--yellow': getClientInvoice?.status === '2'
                  })}
                />
                <span>
                  {clientStatusObj[parseInt(getClientInvoice?.status)]?.text ||
                    '--'}
                </span>
              </div>
            )}
          </Col>
          <Col
            sm={12}
            md={5}
            className={classNames({
              marginLeftAuto: tablet,
              'pl-20px my-1 pe-0': true
            })}
          >
            <div
              className={classNames({
                'd-flex align-items-center': true,
                ' justify-content-end': tablet
              })}
            >
              {tab === 'overview' && (
                <div
                  className="Client-overView--tags skin-change set-in-mobile-preview"
                  onClick={() => setTab('profile')}
                >
                  <Edit2 size={15} />
                  <span>Edit Profile</span>
                </div>
              )}

              {/*<div*/}
              {/*  className="Client-overView--tags skin-change set-msg-in-mobile-preview"*/}
              {/*  onClick={() => setMessageModal(true)}*/}
              {/*>*/}
              {/*  <MessageCircle size={15} />*/}
              {/*  <span>Message</span>*/}
              {/*</div>*/}
              <MessageModal
                open={messageModal}
                setOpen={setMessageModal}
                getClient={getClientInvoice}
              />
            </div>
          </Col>
          <Col sm={12} className="ml-1 mb-1 pb-1">
            <div className="Client-overView__appointments">
              {tab !== 'billing' && (
                <div
                  className="Client-overView__Appt Client-overView__Appt--backgroundBrown skin-change"
                  onClick={() => setTab('profile')}
                >
                  <Calendar size={22} color="#fff" />
                  <span className="fs-s-med">
                    <strong>Last Appt: </strong>

                    {getClientInvoice?.latest_appointment !== null &&
                    !getClientInvoiceLoading
                      ? moment
                          .unix(getClientInvoice?.latest_appointment)
                          .format('MMM DD, YYYY')
                      : '--'}
                  </span>
                </div>
              )}

              <div className="Client-overView__Appt Client-overView__Appt--backgroundEtheraDark skin-change">
                <CheckSquare size={22} color="#fff" />
                <span className="fs-s-med">
                  <strong>
                    {tab !== 'billing' ? 'Next Appointment: ' : 'From: '}
                  </strong>
                  {setPath === 'billing'
                    ? getClientInvoice?.date_started !== null &&
                      !getClientInvoiceLoading
                      ? moment
                          .unix(getClientInvoice?.date_started)
                          .format('MMM DD, YYYY')
                      : '--'
                    : getClientInvoice?.next_appointment !== null &&
                      !getClientInvoiceLoading
                    ? moment
                        .unix(getClientInvoice?.next_appointment)
                        .format('MMM DD, YYYY')
                    : '--'}
                </span>
              </div>
            </div>
          </Col>
        </Row>
        <div className="d-flex justify-content-between  bg-yellow align-items-baseline flex-wrap">
          <div
            className={
              tab !== 'billing'
                ? ' client-tabs d-flex bg-yellow'
                : 'client-tabs d-flex bg-yellow '
            }
          >
            <span
              className={classNames({
                'clients-tabs__unselected': true,
                'client-tabs__selected white-border': tab === 'overview'
              })}
              onClick={() => {
                handleTabChange('overview')
                setTab('overview')
              }}
            >
              Overview
            </span>
            <span
              className={classNames({
                'clients-tabs__unselected': true,
                'client-tabs__selected white-border': tab === 'profile'
              })}
              onClick={() => {
                handleTabChange('profile')
                setTab('profile')
              }}
            >
              Profile
            </span>

            <span
              className={classNames({
                'clients-tabs__unselected px-3': true,
                'client-tabs__selected white-border': tab === 'billing'
              })}
              onClick={() => {
                handleTabChange('billing')
                setTab('billing')
              }}
            >
              Billing
            </span>
          </div>
          {tab === 'billing' && (
            <div className="Client-overView--status mx-1 bg-yellow ">
              <SelectField
                search={false}
                header
                wd={small ? '180px' : '100%'}
                controlMinWidth="180px"
                placeholder="Status"
                // value={statuses[0]}
                data={statuses}
                onChange={(e) => onChangeHandler('status', e)}
              />

              <div className="mx-5px Client-overView--status__button">
                <Button id="new-invoice" className="button-green mb-1">
                  New
                </Button>
                <UncontrolledPopover
                  trigger="legacy"
                  placement="bottom"
                  target="new-invoice"
                  // className='no-overflow'
                >
                  <PopoverBody className="dropDown-popover ">
                    <List>
                      <li
                        onClick={() => {
                          dispatch(resetClientBilling())
                          navigate(`/clients/client/new-invoice/${idx}`)
                        }}
                      >
                        Invoice
                      </li>
                      <li
                      //  onClick={() => navigate('/clients/client/new-superbill')}
                      >
                        Superbill
                      </li>
                      <li
                      // onClick={() => navigate('/clients/client/new-claim')}
                      >
                        Claim
                      </li>
                    </List>
                  </PopoverBody>
                </UncontrolledPopover>
              </div>
            </div>
          )}
        </div>

        <CardBody
          className={classNames({
            'px-0 pb-0': true,
            'p-0': tab === 'billing',
            'bg-yellow':
              loading || clientAppointmentsPending || getAllServiceLoading
          })}
        >
          {tab === 'overview' ? (
            <ClientOverView id={id} tab={tab} />
          ) : tab === 'profile' ? (
            <ClientForm
              id={id}
              required
              save={true}
              getLoading={loading}
              submit={handleSubmit}
              deleteLoading={deleteLoading}
              updateLoading={updateLoading}
              initialValuesData={initialValues}
              listOfServices={listOfServices}
              imageUrl={getClient?.client_insurance[0]?.card}
            />
          ) : tab === 'billing' ? (
            <ClientBillingList status={status} />
          ) : null}
        </CardBody>
      </Card>
    </div>
  )
}

export default ClientProfile

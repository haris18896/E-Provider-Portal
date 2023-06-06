/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'

// ** Utils
import { isObjEmpty, getModifiedValues } from '@utils'

//third party
import classNames from 'classnames'
import { Icon } from '@iconify/react'
import { Card, CardBody } from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'

//component
import ClientForm from '@src/components/screen.components/clients.screen/FormConstants/ClientForm'
import EditClientDocument from '../../../components/screen.components/clients.screen/edit-client-document.component'

// ** Store && Actions
import { useDispatch, useSelector } from 'react-redux'
import {
  getClientAction,
  updateClientAction
} from '../../../redux/client/clientAction'
import { getAllServiceAction } from '../../../redux/setting/billing/service/serviceAction'

const EditClient = () => {
  const provider_id = useSelector((state) => state?.auth?.user?.user_id)

  const param = useParams()
  const { id } = param
  const path = window.location.search
  const setPath = path.slice(1)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [clientStatus, setClientStatus] = useState(0)
  const [tab, setTab] = useState(
    setPath === 'document' ? 'document' : 'clientInfo'
  )
  const { getClient, loading, deleteLoading, updateLoading } = useSelector(
    (state) => state.client
  )
  const handleTabChange = (tab) => {
    const queryParams = tab
    const currentUrl = `/clients/edit-client/${id}`
    const newUrl = currentUrl.includes('?')
      ? `${currentUrl}&${queryParams}`
      : `${currentUrl}?${queryParams}`
    window.history.pushState({}, '', newUrl)
  }

  useEffect(() => {
    if (tab === 'clientInfo') {
      dispatch(
        getAllServiceAction({
          id: provider_id,
          offset: 0,
          limit: 100
        })
      )
      dispatch(
        getClientAction({
          id
        })
      )
    }
  }, [tab])

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
      defaultService: defaultServiceIdList
    }
  }
  const initials = initialValues()
  //** Clean Null Key Pair In Object */
  // eslint-disable-next-line no-unused-vars
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
        // superBillsPayment: values.superBillsPayment,
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
      services: data.services?.length === 0 ? null : data?.services,
      defaultService: values.defaultService?.length === 0 ? null : null
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
      <Card>
        <div className="pt-3 p-2 bg-yellow page-header xSmall-up-start">
          <div className="page-header--title xSmall-up-start d-f-center mt-1 me-1">
            <Icon
              className="page-header--title__leftArrow"
              icon="bx:chevron-left"
              width="40"
              height="40"
              onClick={() => navigate('/clients')}
            />
            <span className="heading-1">Edit Client</span>
          </div>
          {loading ? null : (
            <div className="EditClient ml-1">
              <span className="heading-1">
                {getClient?.first_name} {getClient?.last_name}{' '}
              </span>
            </div>
          )}
        </div>

        <div className="client-tabs d-flex skin-change">
          <span
            className={classNames({
              'clients-tabs__unselected': true,
              'client-tabs__selected white-border': tab === 'clientInfo'
            })}
            onClick={() => {
              handleTabChange('clientInfo')
              setTab('clientInfo')
            }}
          >
            Client Info
          </span>
          <span
            className={classNames({
              'clients-tabs__unselected': true,
              'client-tabs__selected white-border': tab === 'document'
            })}
            onClick={() => {
              handleTabChange('document')
              setTab('document')
            }}
          >
            Documents
          </span>
        </div>

        <CardBody className={loading ? 'p-0' : 'py-2 px-0'}>
          {tab === 'clientInfo' ? (
            <ClientForm
              id={id}
              save={true}
              getLoading={loading}
              submit={handleSubmit}
              updateLoading={updateLoading}
              deleteLoading={deleteLoading}
              listOfServices={listOfServices}
              initialValuesData={initialValues}
              imageUrl={getClient?.client_insurance[0]?.card}
            />
          ) : tab === 'document' ? (
            <EditClientDocument />
          ) : (
            ''
          )}
        </CardBody>
      </Card>
    </div>
  )
}

export default EditClient

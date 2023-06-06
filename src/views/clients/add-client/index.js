/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'

//third party
import classNames from 'classnames'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody } from 'reactstrap'

// components
import AddClientDocuments from '@src/components/screen.components/clients.screen/add-client-documents.component'
import ClientForm from '@src/components/screen.components/clients.screen/FormConstants/ClientForm'
import { useDispatch, useSelector } from 'react-redux'
import { getAllServiceAction } from '../../../redux/setting/billing/service/serviceAction'
import { registerClient } from '../../../redux/client/clientAction'
import { getModifiedValues, isObjEmpty } from '../../../utility/Utils'
import {
  resetRegisterClient,
  resetGetAllClientBilling
} from '../../../redux/client/clientSlice'

const AddClient = () => {
  //**  get Provider ID */
  const providerId = useSelector((state) => state?.auth?.user?.user_id)

  const { loading } = useSelector((state) => state.client)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [tab, setTab] = useState('clientInfo')

  useEffect(() => {
    dispatch(
      getAllServiceAction({
        id: providerId,
        offset: 0,
        limit: 100
      })
    )
  }, [])

  const initialValues = () => {
    return {
      first_name: '',
      middle_name: '',
      last_name: '',
      suffix: '',
      preferred_name: '',
      is_minor: false,
      status: 1,
      messaging: 1,
      client_guardian: [
        {
          status: '1',
          first_name: '',
          last_name: '',
          phone_number: '',
          email: '',
          guardian_addresses: [
            {
              address: '',
              city: '',
              state: '',
              zipcode: ''
            }
          ]
        }
      ],
      phone_number: '',
      email: '',
      addresses: [
        {
          address: '',
          city: '',
          state: '',
          zipcode: ''
        }
      ],
      date_of_birth: '',
      gender: '',
      gender_identity: '',
      relationship_status: '',
      employment_status: '',
      race: '',
      ethnicity: '',
      preferred_language: '',
      note: '',
      date_started: '',
      referred_by: '',
      billing_type: '1',
      emailBillingNotification: 'None',
      insurance_type: 1,
      primary_insured: 1,
      insurance_payer: '',
      member_id: '',
      plan_id: '',
      group_id: '',
      coinsurance: '',
      superBillsPayment: 'Client',
      deductible: '',
      payer_phone_number: '',
      payer_fax: '',
      employer: '',
      authorization_number: '',
      validity: '',
      number_of_uses: '',
      reminding_before_expire: false,
      is_active: false,
      insuranceClaim: false,
      clientServices: [],
      serviceList: '',
      defaultService: []
    }
  }

  function cleanNullKeyPair(obj) {
    for (const propName in obj) {
      if (
        obj[propName] === null ||
        obj[propName] === undefined ||
        obj[propName] === ''
      ) {
        delete obj[propName]
      }
    }
    return obj
  }

  const handleSubmit = ({ values, image }) => {
    const data = {
      first_name: values.first_name,
      middle_name: values.middle_name,
      last_name: values.last_name,
      suffix: values.suffix,
      preferred_name: values.preferred_name,
      email: values.email,
      phone_number: values.phone_number,
      date_started: values.date_started,
      status: values.status,
      messaging: values.messaging,
      is_minor: values.is_minor,
      client_guardian:
        values.is_minor === false ? null : values.client_guardian,
      addresses: values.addresses,
      date_of_birth: values.date_of_birth,
      gender: values.gender,
      gender_identity: values.gender_identity,
      relationship_status: values.relationship_status,
      employment_status: values.employment_status,
      race: values.race,
      ethnicity: values.ethnicity,
      preferred_language: values.preferred_language,
      note: values.note,
      referred_by: values.referred_by,
      billing_type: values.billing_type,
      insurance: {
        member_id: values.member_id,
        plan_id: values.plan_id,
        group_id: values.group_id,
        insurance_type: values.insurance_type,
        primary_insured: values.primary_insured,
        coinsurance: values.coinsurance,
        deductible: values.deductible,
        payer_phone_number: values.payer_phone_number,
        payer_fax: values.payer_fax,
        employer: values.employer,
        insurance_payer: values.insurance_payer
      },
      authorization_tracking: {
        authorization_number: values.authorization_number,
        is_active: values.is_active,
        number_of_uses: values.number_of_uses,
        validity: values.validity,
        reminding_before_expire: values.reminding_before_expire
      },
      services: values.clientServices.map((item) => {
        return {
          service: item?.id,
          fees: item?.fee,
          // eslint-disable-next-line no-unneeded-ternary
          is_default: values.defaultService.includes(item.id)
        }
      })
    }
    const modifiedInsurance = getModifiedValues(data.insurance, initialValues())
    const modifiedAuthorization = getModifiedValues(
      data.authorization_tracking,
      initialValues()
    )

    const checkObjInsurance = isObjEmpty(modifiedInsurance)
    const checkObjAuthorization = isObjEmpty(modifiedAuthorization)

    const newData = {
      ...data,

      client_insurance:
        checkObjInsurance === true
          ? null
          : {
              ...modifiedInsurance,
              primary_insured: values.primary_insured,
              insurance_type: values.insurance_type
            },
      authorization_tracking:
        checkObjAuthorization === true ? null : modifiedAuthorization,
      services: data.services?.length === 0 ? null : data?.services
    }

    const FilterClientData = cleanNullKeyPair(newData)
    dispatch(registerClient({ data: FilterClientData, img: image, navigate }))
  }

  useEffect(() => {
    return () => {
      dispatch(resetRegisterClient())
      dispatch(resetGetAllClientBilling())
    }
  }, [])

  return (
    <div>
      <Card>
        <div className="pt-3 p-2 bg-yellow page-header xSmall-up-start">
          <div className="page-header--title xSmall-up-start d-f-center">
            <Icon
              className="page-header--title__leftArrow"
              icon="bx:chevron-left"
              width="40"
              height="40"
              onClick={() => navigate('/clients')}
            />
            <span className="heading-1">Add Client</span>
          </div>
        </div>

        <div className="client-tabs d-flex skin-change">
          <span
            className={classNames({
              'clients-tabs__unselected': true,
              'client-tabs__selected white-border': tab === 'clientInfo'
            })}
            onClick={() => setTab('clientInfo')}
          >
            Client Info
          </span>
          <span
            className={classNames({
              'clients-tabs__unselected': true,
              'client-tabs__selected white-border': tab === 'document'
            })}
            onClick={() => setTab('document')}
          >
            Documents
          </span>
        </div>

        <CardBody style={{ paddingLeft: 0, paddingRight: 0 }}>
          {tab === 'clientInfo' ? (
            <ClientForm
              save={false}
              submit={handleSubmit}
              registerLoading={loading}
              initialValuesData={initialValues}
            />
          ) : tab === 'document' ? (
            <AddClientDocuments />
          ) : (
            ''
          )}
        </CardBody>
      </Card>
    </div>
  )
}

export default AddClient

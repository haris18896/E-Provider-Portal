import { Fragment, useState } from 'react'
// third party
import classNames from 'classnames'
import { Button, Card } from 'reactstrap'

// components
import { Billing } from './billing'
import { Services } from './services'
import ServiceModal from '../../../../components/screen.components/settings.component/billing/table/billing-service-table/service-modal/ServiceModal'
import { useSelector } from 'react-redux'

const SettingBillingAndServices = () => {
  //**  get Provider ID */
  const id = useSelector((state) => state?.auth?.user?.user_id)


  const [tab, setTab] = useState('billing')
  const [open, setOpen] = useState(false)
  const handleOpenModal = () => {
    setOpen(!open)
   
  }

  return (
    <div>
      <Card className="billing">
        <div className="p-2 pt-3 bg-yellow">
          <div className=" d-flex w-100 align-items-center justify-content-between flex-wrap">
            <div>
              <span className="heading-1">Billing & Services</span>
            </div>
            <div>
              {tab === 'services' && (
                <Button
                  className="button-green btn add-service"
                  onClick={() => handleOpenModal()}
                >
                  Add Service
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="head--tabs bg-yellow ">
          {['Billing', 'Services'].map((item, index) => (
            <span
              key={index}
              className={classNames({
                'span-tabs px-3': true,
                'head--tabs__selected white-border':
                  tab === item.toLowerCase().trim()
              })}
              onClick={() => setTab(item.toLowerCase().trim())}
            >
              {item}
            </span>
          ))}
        </div>
        <ServiceModal
          open={open}
          handleOpen={() => handleOpenModal()}
          id={id}
          edit={false}
        />

        <Fragment>
          {tab === 'billing' ? (
            <Billing />
          ) : tab === 'services' ? (
            <Services />
          ) : (
            ''
          )}
        </Fragment>
      </Card>
    </div>
  )
}

export default SettingBillingAndServices

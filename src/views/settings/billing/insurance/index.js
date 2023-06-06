import { Fragment, useState } from 'react'
// third party
import classNames from 'classnames'
import { Card } from 'reactstrap'
// components
import { BillingProviderInfo } from './BillingProviderInfo'
import { InsurancePayer } from './InsurancePayer'

const SettingInsurance = () => {
  const [tab, setTab] = useState('Billing Provider Info')

  return (
    <div>
      <Card className="billing">
        <div className="p-2 pt-3 bg-yellow">
          <span className="heading-1">Billing & Services</span>
        </div>

        <div className="head--tabs bg-yellow">
          {['Billing Provider Info', 'Insurance Payer'].map((item, index) => (
            <span
              key={index}
              className={classNames({
                'span-tabs': true,
                'head--tabs__selected white-border': tab === item
              })}
              onClick={() => setTab(item)}
            >
              {item}
            </span>
          ))}
        </div>

        <Fragment>
          {tab === 'Billing Provider Info' ? (
            <BillingProviderInfo />
          ) : tab === 'Insurance Payer' ? (
            <InsurancePayer />
          ) : (
            ''
          )}
        </Fragment>
      </Card>
    </div>
  )
}

export default SettingInsurance

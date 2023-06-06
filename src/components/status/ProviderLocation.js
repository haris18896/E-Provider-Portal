import { Icon } from '@iconify/react'

export const placeOfService = {
  1: { text: '123 Therapist Street, Los Angles, CA, 90001', value: 1 },
  2: { text: '02 - Therapist Street, Los Angles, CA, 90102', value: 2 }
}

export const IconData = {
  1: {
    text: 'Office',
    value: 1,
    icon: (
      <div className="react-select-icon">
        <Icon icon="bxs:building" width="15" height="15" />
      </div>
    )
  },
  2: {
    text: 'Home',
    value: 2,
    icon: (
      <div className="react-select-icon">
        <Icon icon="ri:building-4-fill" width="15" height="15" />
      </div>
    )
  }
}

export const StateData = {
  AL: {
    text: 'AL',
    value: 'AL'
  },
  CA: {
    text: 'CA',
    value: 'CA'
  },
  IN: {
    text: 'IN',
    value: 'IN'
  },
  Ar: {
    text: 'Ar',
    value: 'Ar'
  }
}

/* eslint-disable quote-props */
import * as Yup from 'yup'

// react-select constants
export const clientStatus = [
  {
    text: 'Active',
    value: 1
  },
  {
    text: 'Inactive',
    value: 2
  }
]
export const statesList = [
  {
    text: 'AL',
    value: 'AL'
  },
  {
    text: 'PK',
    value: 'PK'
  },
  {
    text: 'IN',
    value: 'IN'
  },
  {
    text: 'AR',
    value: 'AR'
  }
]

export const gender = [
  {
    text: 'Unknown',
    value: 1
  },
  {
    text: 'Male',
    value: 2
  },
  {
    text: 'Female',
    value: 3
  },
  {
    text: 'NonBinary',
    value: 4
  },
  {
    text: 'Transgender',
    value: 5
  }
]
export const genderObj = {
  1: {
    text: 'Unknown',
    value: 1
  },
  2: {
    text: 'Male',
    value: 2
  },
  3: {
    text: 'Female',
    value: 3
  },
  4: {
    text: 'NonBinary',
    value: 4
  },
  5: {
    text: 'Transgender',
    value: 5
  }
}
export const maritalStatus = [
  {
    text: 'Married',
    value: 1
  },
  {
    text: 'Single',
    value: 2
  },
  {
    text: 'Divorced',
    value: 3
  },
  {
    text: 'Other',
    value: 4
  }
]
export const maritalStatusObj = {
  1: {
    text: 'Married',
    value: 1
  },
  2: {
    text: 'Single',
    value: 2
  },
  3: {
    text: 'Divorced',
    value: 3
  },
  4: {
    text: 'Other',
    value: 4
  }
}
export const Employment = [
  {
    text: 'Full time',
    value: 1
  },
  {
    text: 'Part time',
    value: 2
  },
  {
    text: 'Unemployed',
    value: 3
  },
  {
    text: 'NA',
    value: 4
  }
]
export const EmploymentObj = {
  1: {
    text: 'Full time',
    value: 1
  },
  2: {
    text: 'Part time',
    value: 2
  },
  3: {
    text: 'UnEmployed',
    value: 3
  },
  4: {
    text: 'NA',
    value: 4
  }
}
export const languageList = [
  {
    text: 'Chinese',
    value: 'zh'
  },
  {
    text: 'English',
    value: 'en'
  },
  {
    text: 'Japanese',
    value: 'ja'
  },
  {
    text: 'Korean',
    value: 'ko'
  },
  {
    text: 'Hindi',
    value: 'hi'
  },
  {
    text: 'Spanish',
    value: 'es'
  },
  {
    text: 'Arabic',
    value: 'ar'
  },
  {
    text: 'Malay',
    value: 'ms'
  },
  {
    text: 'Russian',
    value: 'ru'
  },
  {
    text: 'Bengali',
    value: 'bn'
  },
  {
    text: 'PORTUGUESE',
    value: 'pt'
  },
  {
    text: 'FRENCH',
    value: 'fr'
  },
  {
    text: 'VIETNAMESE',
    value: 'vi'
  },
  {
    text: 'OTHER',
    value: 'ot'
  }
]
export const languageListObj = {
  zh: {
    text: 'Chinese',
    value: 'zh'
  },
  en: {
    text: 'English',
    value: 'en'
  },
  ja: {
    text: 'Japanese',
    value: 'ja'
  },
  ko: {
    text: 'Korean',
    value: 'ko'
  },
  hi: {
    text: 'Hindi',
    value: 'hi'
  },
  es: {
    text: 'Spanish',
    value: 'es'
  },
  ar: {
    text: 'Arabic',
    value: 'ar'
  },
  ms: {
    text: 'Malay',
    value: 'ms'
  },
  ru: {
    text: 'Russian',
    value: 'ru'
  },
  bn: {
    text: 'Bengali',
    value: 'bn'
  },
  pt: {
    text: 'PORTUGUESE',
    value: 'pt'
  },
  fr: {
    text: 'FRENCH',
    value: 'fr'
  },
  vi: {
    text: 'VIETNAMESE',
    value: 'vi'
  },
  ot: {
    text: 'OTHER',
    value: 'ot'
  }
}
export const billingNotification = [
  {
    text: 'None',
    value: 'None'
  },
  {
    text: 'All',
    value: 'All'
  },
  {
    text: 'Specific',
    value: 'Specific'
  }
]

export const insurancePayer = [
  {
    text: 'Client',
    value: '1'
  },
  {
    text: 'Parent',
    value: '2'
  }
]

export const sendPaymentTo = [
  {
    text: 'Client',
    value: 'Client'
  },
  {
    text: 'Parent',
    value: 'Parent'
  }
]

// guardian options list
export const guardianStateOptions = [
  { label: 'Legal Guardian', value: '1' },
  { label: 'Parent', value: '2' },
  { label: 'Family Member', value: '3' },
  { label: 'Other', value: '4' }
]

// email Reminder options
export const emailReminderOptions = [
  { label: 'Appointment', value: 'appointment' },
  { label: 'Billing', value: 'billing' }
]

//  client status
export const clientStatusObj = {
  1: { text: 'Active' },
  2: { text: 'Inactive' }
}

// Race and Ethnicity options
export const raceAndEthnicityOptions = [
  {
    label: 'American Indian or Alaska Native',
    value: 1
  },
  { label: 'Asian', value: 5 },
  { label: 'Black or African American', value: 2 },
  { label: 'Hispanic or Latin', value: 6 },
  {
    label: 'Middle Eastern or North African',
    value: 3
  },
  {
    label: 'Native Hawaiian or other Pacific Islander',
    value: 7
  },
  { label: 'White', value: 4 },
  {
    label: 'Race or Ethnicity not listed',
    value: 8
  }
]

export const raceAndEthnicityOptionsLabel = {
  1: {
    label: 'American Indian or Alaska Native',
    value: 1
  },
  5: { label: 'Asian', value: 5 },
  2: { label: 'Black or African American', value: 2 },
  6: { label: 'Hispanic or Latin', value: 6 },
  3: {
    label: 'Middle Eastern or North African',
    value: 3
  },
  7: {
    label: 'Native Hawaiian or other Pacific Islander',
    value: 7
  },
  4: { label: 'White', value: 4 },
  8: {
    label: 'Race or Ethnicity not listed',
    value: 8
  }
}

// Billing Type options
export const billingTypeOptions = [
  { label: 'Self-Pay', value: '1' },
  { label: 'Insurance', value: '2' }
]

export const clientStatusList = [
  { label: 'Active', value: 1 },
  { label: 'Inactive', value: 2 }
]

// Auto generated billing document options
export const autoGenerateBillingDocumentOptions = [
  {
    label: 'Automatically create monthly Statement for this client',
    value: 'monthlyStatement'
  },
  {
    label: 'Automatically create monthly Super bills for this client',
    value: 'monthlySuperBill'
  }
]

// const Primary Insured options
export const primaryInsuredPersonOptions = [
  { label: 'Client', value: 1 },
  { label: "Client's Spouse", value: 2 },
  { label: "Client's Parent", value: 3 },
  { label: 'Other', value: 4 }
]

// Insurance Type options
export const insuranceTypeOptions = [
  { label: 'Primary Insurance', value: 1 },
  { label: 'Secondary Insurance', value: 2 },
  { label: 'Other', value: 3 }
]

// Client services Options
export const clientServicesOptions = [
  { text: '90873', value: '90873', time: '60', charges: '150' },
  { text: '89789', value: '89789', time: '40', charges: '130' },
  { text: '12389', value: '12389', time: '30', charges: '100' },
  { text: '78689', value: '78689', time: '20', charges: '50' },
  { text: '89756', value: '89756', time: '120', charges: '200' },
  { text: '89757', value: '89757', time: '130', charges: '210' },
  { text: '89758', value: '89758', time: '90', charges: '170' },
  { text: '89759', value: '89759', time: '80', charges: '180' },
  { text: '89760', value: '89760', time: '70', charges: '160' }
]

// american phone number validation regex
export const phoneRegex = '^(([0-9]{3}) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$'

// supported image formats
export const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png']

// *****************************************************************************************************************

// Client Profile validation schema
export const ClientFormValidationSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(3, 'First name should be at least 3 characters long')
    .max(15, 'First name should not exceed more than 15 characters')
    .required('First Name is a required field'),
  middle_name: Yup.string()
    .min(3, 'Middle name should be at least 3 characters long')
    .max(10, 'Middle name should not exceed more than 10 characters'),
  last_name: Yup.string()
    .min(3, 'Last name should be at least 3 characters long')
    .max(15, 'Last name should not exceed more than 15 characters')
    .required('Last Name is a required field'),
  suffix: Yup.string()
    .min(2, 'Suffix should be at least 2 characters long')
    .max(10, 'Suffix should not exceed more than 10 characters'),
  preferred_name: Yup.string()
    .min(3, 'Preferred name should be at least 3 characters long')
    .max(20, 'Preferred name should not exceed more than 20 characters'),
  client_guardian: Yup.array().of(
    Yup.object().shape({
      status: Yup.string(),
      first_name: Yup.string()
        .min(3, 'First name should be at least 3 characters long')
        .max(15, 'First name should not exceed more than 15 characters'),
      last_name: Yup.string()
        .min(3, 'Last name should be at least 3 characters long')
        .max(15, 'Last name should not exceed more than 15 characters'),
      phone_number: Yup.string().nullable(),
      email: Yup.string().email(),
      address: Yup.string()
        .min(3, 'Street Address has to be at least 5 characters long')
        .max(50, "Street Address shouldn't exceed more than 50 characters"),
      city: Yup.string()
        .min(2, 'City has to be at least 5 characters long')
        .max(20, "City shouldn't exceed more than 20 characters"),
      state: Yup.string().max(
        2,
        'Country code should not exceed more than 2 characters'
      ),
      zipcode: Yup.number()
        .min(3, 'Zip code has to be at least 3 characters long ')
        .max(7, 'Zip code should not exceed more than 7 characters')
    })
  ),
  phone_number: Yup.string(),
  email: Yup.string().email().required('Email is a required field'),
  emailReminder: Yup.array().of(Yup.string()).nullable(),
  addresses: Yup.array().of(
    Yup.object().shape({
      address: Yup.string()
        .min(3, 'Street Address has to be at least 5 characters long')
        .max(50, "Street Address shouldn't exceed more than 50 characters"),
      city: Yup.string()
        .min(2, 'City has to be at least 5 characters long')
        .max(20, "City shouldn't exceed more than 20 characters"),
      state: Yup.string().max(
        2,
        'Country code should not exceed more than 2 characters'
      ),
      zipcode: Yup.string()
        .min(3, 'Zip code has to be at least 3 characters long ')
        .max(7, 'Zip code should not exceed more than 7 characters')
    })
  ),
  date_of_birth: Yup.string(),
  gender: Yup.string(),
  gender_identity: Yup.string().max(
    140,
    'Gender Identity should not exceed more than 140 characters'
  ),
  relationship_status: Yup.string(),
  employment_status: Yup.string(),
  race: Yup.string(),
  ethnicity: Yup.string().max(
    140,
    "Race & Ethnicity details shouldn't exceed more than 140 characters "
  ),
  preferred_language: Yup.string(),
  note: Yup.string(),
  date_started: Yup.string(),
  referred_by: Yup.string(),
  billing_type: Yup.string(),
  autoBillingDocument: Yup.array().of(Yup.string()).nullable(),
  emailBillingNotification: Yup.string(),
  insurance_type: Yup.string().required('Insurance type is a required field'),
  primary_insured: Yup.string().required(
    'Primary Insured person is a required field'
  ),
  insurance_payer: Yup.string(),
  member_id: Yup.string().max(
    64,
    "Member Id shouldn't exceed more than 64 character's"
  ),
  plan_id: Yup.number(),
  group_id: Yup.number(),
  coinsurance: Yup.string().max(
    7,
    'CoPay/Co-Insurance should not exceed more than 7 digits'
  ),
  superBillsPayment: Yup.string(),
  deductible: Yup.string().max(
    7,
    'Deductible should not exceed more than 7 digits'
  ),
  payer_phone_number: Yup.string(),
  payer_fax: Yup.string(),
  employer: Yup.string()
    .matches(/^[A-Za-z]+$/, 'Employee and school must be Alphabetical')
    .min(5, 'Employee or School field should be more than 5 characters')
    .max(100, 'Employee or School should not exceed more than 100 characters'),
  // image: Yup.mixed()
  //   .test('fileSize', 'File size is too large!', (value) => {
  //     if (value) {
  //       return value.size < 2 * 1024 * 1024
  //     }
  //     return true
  //   })
  //   .test('fileFormat', 'File format is not supported!', (value) => {
  //     if (value) {
  //       return SUPPORTED_FORMATS.includes(value.type)
  //     }
  //     return true
  //   }),
  authorization_number: Yup.string(),
  validity: Yup.string(),
  number_of_uses: Yup.number(),
  reminding_before_expire: Yup.boolean(),
  is_active: Yup.boolean(),
  insuranceClaim: Yup.boolean(),
  clientServices: Yup.array().of(
    Yup.object().shape({
      text: Yup.string(),
      charges: Yup.number(),
      time: Yup.string()
    })
  ),
  serviceList: Yup.string()
  // defaultService: Yup.string()
})

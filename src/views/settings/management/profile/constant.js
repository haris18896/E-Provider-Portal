import * as Yup from 'yup'
import validator from 'validator'

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png']

export const settingMyProfileValidation = Yup.object().shape(
  {
    first_name: Yup.string()
      .min(3, 'First Name should be at least 3 characters long')
      .max(15, 'First Name should not exceed more than 15 characters')
      .required('First Name is a required field'),
    last_name: Yup.string()
      .min(3, 'Last Name should be at least 3 characters long')
      .max(15, 'Last Name should not exceed more than 15 characters')
      .required('Last Name is a required field'),
    middle_name: Yup.string()
      .min(3, 'Middle Name should be at least 3 characters long')
      .max(15, 'Middle Name should not exceed more than 15 characters'),
    suffix: Yup.string()
      .min(3, 'Suffix should be at least 3 characters long')
      .max(15, 'Suffix should not exceed more than 15 characters'),
    day: Yup.string()
      .test('day', 'Enter valid day', (value) => {
        return (value < 32 && value > 0) || value === undefined
      })
      .when(['month', 'year'], {
        is: (month, year) => month?.length > 0 || year?.length > 0,
        then: (schema) => schema.required('Please fill day')
      }),
    month: Yup.string()
      .test('month', 'Enter valid month', (value) => {
        return (value < 13 && value > 0) || value === undefined
      })
      .when(['day', 'year'], {
        is: (day, year) => {
          return day?.length > 0 || year?.length > 0
        },
        then: (schema) => schema.required('Please fill month')
      }),
    year: Yup.string()
      .test('year', 'Enter valid year', (value) => {
        return (value < 10000 && value > 0) || value === undefined
      })
      .when(['month', 'day'], {
        is: (month, day) => month?.length > 0 || day?.length > 0,
        then: (schema) => schema.required('Please fill  year')
      }),
    practice: Yup.string()
      .min(3, 'Practice Name should be at least 3 characters long')
      .max(15, 'Practice Name should not exceed more than 15 characters')
      .required('Practice Name is a required field'),
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
    email: Yup.string().email().required('Account Email is a required field'),
    phone_number: Yup.string().required(
      'Mobile Phone Number is a required field'
    ),
    provider_license: Yup.array().of(
      Yup.object().shape({
        license_type: Yup.string(),
        license_number: Yup.string(),
        expire_date: Yup.string(),
        state: Yup.string()
          .max(2, 'State must be 2 characters long')
          .uppercase()
      })
    ),
    npi: Yup.string()
      .min(3, 'NPI Type 1 should be at least 3 characters long')
      .max(15, 'NPI Type 1 should not exceed more than 15 characters'),
    npi_two: Yup.string()
      .min(3, 'NPI Type 2 should be at least 3 characters long')
      .max(15, 'NPI Type 2 should not exceed more than 15 characters'),
    tax: Yup.string()
      .min(3, 'NPI Type 1 should be at least 3 characters long')
      .max(15, 'NPI Type 1 should not exceed more than 15 characters'),
    tax_two: Yup.string()
      .min(3, 'NPI Type 2 should be at least 3 characters long')
      .max(15, 'NPI Type 2 should not exceed more than 15 characters'),
    taxonomy: Yup.string()
      .min(3, 'Taxonomy Code should be at least 3 characters long')
      .max(15, 'Taxonomy Code should not exceed more than 15 characters'),
    caqh: Yup.string()
      .min(3, 'Taxonomy Code should be at least 3 characters long')
      .max(15, 'Taxonomy Code should not exceed more than 15 characters'),
    password: Yup.string().test(
      'strong-password',
      'Password must contain at least 8 characters, one number, one uppercase letter and one lowercase letter',
      (value) => {
        if (!value) {
          return true
        }
        return validator.isStrongPassword(value, {
          minLength: 8,
          minLowercase: 1,
          minNumbers: 1,
          minUppercase: 1,
          minSymbols: 0
        })
      }
    ),
    confirmNewPassword: Yup.string().oneOf(
      [Yup.ref('password'), null],
      'Passwords do not match!'
    )
  },
  [
    ['day', 'month'], // <--- adding your fields which need validation
    ['day', 'year'],
    ['month', 'year'],
    ['month', 'day'],
    ['year', 'month'],
    ['year', 'day']
  ]
)

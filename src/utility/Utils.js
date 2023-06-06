import { DefaultRoute } from '../router/routes'
import moment from 'moment-timezone'
import _ from 'lodash'
import * as Yup from 'yup'

export const isObjEmpty = (obj) => Object.keys(obj).length === 0

export const kFormatter = (num) => {
  if (num > 999) {
    return `${(num / 1000).toFixed(1)}k`
  } else return num
}

export const htmlToString = (html) => html.replace(/<\/?[^>]+(>|$)/g, '')
export const getTime = (data, format = 'LT') =>
  data && moment(data).format(format)

const isToday = (date) => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

export const formatDate = (
  value,
  formatting = { month: 'short', day: 'numeric', year: 'numeric' }
) => {
  if (!value) return value
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

export const isUserLoggedIn = () => localStorage.getItem('userData')
export const getUserData = () => JSON.parse(localStorage.getItem('userData'))

export const getHomeRouteForLoggedInUser = (role) => {
  if (role) return DefaultRoute
  return '/login'
}
// export const getHomeRouteForLoggedInUser = (userRole) => {
//   if (userRole === 'admin') return DefaultRoute
//   if (userRole === 'client') return '/access-control'
//   return '/login'
// }

export const selectThemeColors = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})

export const getUserFullName = (user, defaultName = 'Other') => {
  if (!user) {
    return defaultName
  }
  // const preferredName = user.preferredName ? `"${user.preferredName}"` : ''
  const fullName = `${user.firstName || ''} ${user.middleName || ''} ${
    user.lastName || ''
  }`
    .trim()
    .replace(/ +(?= )/g, '')
  const fullNameRs = _.isEmpty(fullName) ? defaultName : fullName

  return fullNameRs
}

// American Phone Number
export const PhoneUS = (value, previousValue) => {
  if (!value) return value
  const currentValue = value.replace(/[^\d]/g, '')
  const cvLength = currentValue.length
  if (!previousValue || value.length > previousValue.length) {
    if (cvLength < 4) return currentValue
    if (cvLength < 7) {
      return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`
    }
    return `(${currentValue.slice(0, 3)}) ${currentValue.slice(
      3,
      6
    )}-${currentValue.slice(6, 10)}`
  }
}

export const getChangedData = (oldData, newData) => {
  const changedData = []

  newData.forEach((newObj) => {
    const oldObj = oldData.find((o) => o.id === newObj.id)

    if (!oldObj) {
      changedData.push({ id: newObj.id, services: newObj.services })
    } else {
      const changedServices = []

      newObj.services.forEach((newService) => {
        const oldService = oldObj.services.find(
          (s) => s.service === newService.service
        )

        if (!oldService || oldService.fees !== newService.fees) {
          changedServices.push(newService)
        }
      })

      if (changedServices.length > 0) {
        changedData.push({ id: newObj.id, services: changedServices })
      }
    }
  })

  return changedData
}

// for patch request
export const getModifiedValues = (values, initialValues) => {
  const modifiedValues = {}

  if (values) {
    Object.entries(values).forEach((entry) => {
      const key = entry[0]
      const value = entry[1]

      if (value !== initialValues[key]) {
        modifiedValues[key] = value
      }
    })
  }

  return modifiedValues
}

// export const getSuperModifiedValues = (values, initialValues) => {
//   const modifiedValues = {}
//
//   if (values) {
//     Object.entries(values).forEach((entry) => {
//       const key = entry[0]
//       const value = entry[1]
//       const initialValue = initialValues[key]
//
//       if (key === 'appointment_services') {
//         if (JSON.stringify(value) !== JSON.stringify(initialValue)) {
//           modifiedValues[key] = value
//         }
//       } else if (
//         Array.isArray(value) &&
//         Array.isArray(initialValue) &&
//         JSON.stringify(value) !== JSON.stringify(initialValue)
//       ) {
//         modifiedValues[key] = value
//       } else if (
//         typeof value === 'object' &&
//         value !== null &&
//         typeof initialValue === 'object' &&
//         initialValue !== null &&
//         JSON.stringify(value) !== JSON.stringify(initialValue)
//       ) {
//         modifiedValues[key] = value
//       } else if (value !== initialValue) {
//         modifiedValues[key] = value
//       }
//     })
//   }
//
//   return modifiedValues
// }

// export const getSuperModifiedValues = (values, initialValues) => {
//   const modifiedValues = {}
//
//   if (values) {
//     Object.entries(values).forEach((entry) => {
//       const key = entry[0]
//       const value = entry[1]
//       const initialValue = initialValues[key]
//
//       if (Array.isArray(value) && Array.isArray(initialValue)) {
//         if (JSON.stringify(value) !== JSON.stringify(initialValue)) {
//           modifiedValues[key] = value
//         }
//       } else if (
//         typeof value === 'object' &&
//         value !== null &&
//         typeof initialValue === 'object' &&
//         initialValue !== null
//       ) {
//         if (JSON.stringify(value) !== JSON.stringify(initialValue)) {
//           modifiedValues[key] = value
//         }
//       } else if (value !== initialValue) {
//         modifiedValues[key] = value
//       }
//     })
//   }
//
//   return modifiedValues
// }

export const getSuperModifiedValues = (values, initialValues) => {
  const modifiedValues = {}

  if (values) {
    Object.entries(values).forEach((entry) => {
      const key = entry[0]
      const value = entry[1]
      const initialValue = initialValues[key]

      if (key === 'appointment_services') {
        if (JSON.stringify(value) !== JSON.stringify(initialValue)) {
          modifiedValues[key] = value
        }
      } else if (Array.isArray(value) && Array.isArray(initialValue)) {
        if (JSON.stringify(value) !== JSON.stringify(initialValue)) {
          modifiedValues[key] = value
        }
      } else if (
        typeof value === 'object' &&
        value !== null &&
        typeof initialValue === 'object' &&
        initialValue !== null
      ) {
        if (JSON.stringify(value) !== JSON.stringify(initialValue)) {
          modifiedValues[key] = value
        }
      } else if (value !== initialValue) {
        modifiedValues[key] = value
      }
    })
  }

  return modifiedValues
}

export const dateUnix = (date) => {
  return moment(`${date}`).tz('America/Los_Angeles').unix()
}

export const dateUS = (date) => {
  return moment.unix(`${date}`).tz('America/Los_Angeles').format('M/D/YYYY')
}

// export const dateUnix = (date) => {
//   return moment(`${date}`).unix()
// }
//
// export const dateUS = (date) => {
//   return moment.unix(`${date}`).format('M/D/YYYY')
// }

export const dateFormatted = (date, format) => {
  return moment.unix(`${date}`).format(format)
}

export const timeConvertToPmAm = (time) => {
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time]

  if (time.length > 1) {
    time = time.slice(1)
    time.splice(3, 1)
    time[5] = +time[0] < 12 ? ' AM' : ' PM'
    time[0] = +time[0] % 12 || 12
  }
  return time.join('')
}

export const timeFormat = (timeField) => {
  return Yup.string().matches(
    /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
    `${timeField} must be in the format HH:mm:ss`
  )
}

export const endTimeGreaterThanStartTime = (startTimeField, endTimeField) => {
  return Yup.string().test(
    endTimeField,
    `${endTimeField} must be greater than ${startTimeField}`,
    // eslint-disable-next-line no-unused-vars
    function (value) {
      const { [startTimeField]: startTime, [endTimeField]: endTime } =
        // eslint-disable-next-line no-invalid-this
        this.parent
      return !startTime || !endTime || startTime < endTime
    }
  )
}

export const checkForEmptyValues = (obj) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      if (value === '' || value === null || value === undefined) {
        return new Error(`Value for key '${key}' is empty, null or undefined.`)
      }
    }
  }
  return null // return null if there are no empty values
}

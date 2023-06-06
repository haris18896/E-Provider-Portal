export const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}

export const groupBadgeStyles = {
  backgroundColor: '#EBECF0',
  borderRadius: '2em',
  color: '#172B4D',
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 'normal',
  lineHeight: '1',
  minWidth: 1,
  padding: '0.16666666666667em 0.5em',
  textAlign: 'center'
}

export const billingTypeOptions = {
  1: { label: 'Self-Pay', value: 1 },
  2: { label: 'Insurance', value: 2 }
}

export const weeklyRepeats = [
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 }
]

export const numberOfWeeks = [
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
  { value: 6 },
  { value: 7 },
  { value: 8 },
  { value: 9 },
  { value: 10 },
  { value: 11 },
  { value: 12 },
  { value: 13 },
  { value: 14 },
  { value: 15 },
  { value: 16 },
  { value: 17 },
  { value: 18 },
  { value: 19 },
  { value: 20 },
  { value: 21 },
  { value: 22 },
  { value: 23 },
  { value: 24 },
  { value: 25 }
]

export const formatGroupLabel = (data) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
)

import React from 'react'

function BookingStats({ name, stat, bg, remaining }) {

  return (
    <div
      className="d-flex flex-column appointment-stat-div skin-change"
      style={bg}
    >
      <span className="appointment-stat-name">{name}</span>
      <p className="appointment-stat">{!remaining && '$'} {stat}</p>
    </div>
  )
}

export default BookingStats

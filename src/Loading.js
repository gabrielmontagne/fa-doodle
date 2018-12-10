import React from 'react'

export default function Loading({ loading = '' }) {
  return (
    <div>
      <h1>Loading</h1>
      <p>loading {loading}</p>
    </div>
  )
}

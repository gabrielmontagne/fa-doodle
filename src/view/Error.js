import React from 'react'

export default function Error({error}) {
  return <div>
    <h1>Error</h1>
    <pre>
      { error.toString() }
    </pre>
  </div> 
}

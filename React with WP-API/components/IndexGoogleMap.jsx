import React from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'

// The Map Component
const IndexGoogleMap = withScriptjs(withGoogleMap((props) => {
    return <GoogleMap defaultZoom={12} defaultCenter={{ lat: 51.502501, lng: -0.128998 }}>
       { props.markerData.map( person => {
            if( person.post_longitude && person.post_latitude) return <Marker key={ person.id } position={{ lat: parseFloat(person.post_latitude), lng: parseFloat(person.post_longitude) }} />
        })  } 
    </GoogleMap>
}))

export default IndexGoogleMap

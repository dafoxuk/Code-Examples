import React from 'react'
import { HashRouter as Router, Route, Link, browserHistory } from 'react-router-dom'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
require('es6-promise').polyfill()
import axios from 'axios'

const baseURL = 'http://aws.dafox.uk'
import Index from './components/Index.jsx'
import Profile from './components/Profile.jsx'

/*global google */

// The App Component, housing the Routes
export default class App extends React.Component {
    render() {
        return <Router history={ browserHistory }>
                    <div>
                        <Route exact path="/" component={Index} />
                        <Route path="/:slug" component={Profile} />
                    </div>
            </Router>
    }
}

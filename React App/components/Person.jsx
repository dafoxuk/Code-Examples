import React from 'react'
import { Route, Link } from 'react-router-dom'
const baseURL = 'http://aws.dafox.uk'


// The Person Component, used by the Index
export default class Person extends React.Component {
    render() {
        return <Route path="/person">
                <div>
                    {this.props.person.featured_image ? 
                        <p><img src={baseURL + "/wp-content/uploads/" + this.props.person.featured_image} width="100"/></p>
                        : null
                    }
                    <h3>{this.props.person.title.rendered}</h3> 
                    { this.props.person.geodir_website ?
                        <p>Website: {this.props.person.geodir_website}</p>
                    : null }
                    <p><Link to={"/" + this.props.person.slug}><button>Get details..</button></Link></p>
                </div>
            </Route>
    }
}

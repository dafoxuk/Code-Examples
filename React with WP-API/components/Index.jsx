import React from 'react'
import axios from 'axios'
const baseURL = 'http://aws.dafox.uk'
import IndexGoogleMap from './IndexGoogleMap.jsx'
import Search from './Search.jsx'
import Filters from './Filters.jsx'
import Person from './Person.jsx'

// The Index Component, listing the profiles
export default class Index extends React.Component {
    constructor() {
        super()
        this.state = {
            isLoading: true,
            data: [],
            services: [],
            search: '',
            filters: [],
            postcode: ''
        }
    }

    componentDidMount() {
        // Get Profile Data
        axios.get(baseURL + "/wp-json/wp/v2/gd_person")
            .then(response => {
                return response.data
            })
            .then(data => {
                this.setState({ isLoading: false, data: data })
            }).catch(err => {
                console.log(err)
            })

        // Get Services Data
        axios.get(baseURL + "/wp-json/happyhounds/v1/services")
            .then(response => {
                return response.data
            }).then(serviceData => {
                this.setState({ services: serviceData });
            }).catch(err => {
                console.log(err)
            })
    }

    handleChangeSearch(event) {
        this.setState({ search: event.target.value })
    }

    handleChangeFilter(event) {
        const filters = this.state.filters
        const selected = event.target.value
        if (filters.indexOf(selected) !== -1) {
            filters.splice(filters.indexOf(selected), 1)
        }
        else {
            filters.push(selected)
        }
        this.setState({ filters: filters })
    }

    handleChangePostcode(event) {
        this.setState({ postcode: event.target.value })
    }

    render() {
        const { isLoading, data, services, search, filters, postcode } = this.state

        // Apply filters
        const filtered = data
            .filter(entry => {
                return entry.title.rendered.toLowerCase().indexOf(search.toLowerCase()) !== -1
            })
            .filter(entry => {
                if (entry.geodir_services && filters) {
                    const found = filters.filter((value) => { return entry.geodir_services.split(',').indexOf(value) })
                    return found.length === filters.length
                }
                return filters.length === 0
            })
            .sort((a, b) => {

            })

        if (isLoading) {
            return <p>Loading...</p>
        }

        return <div>
            <IndexGoogleMap 
              isMarkerShown
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=xxxxxxxxxxxxxxxxxxxxc&v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `400px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
              markerData={filtered}
            />
            
            <Search keywords={search} handleChangeSearch={this.handleChangeSearch.bind(this)} />   

            <p>Filter by...</p>
            { services.map( (service, key) => {
                return <Filters key={key} service={service} onFilter={ this.handleChangeFilter.bind(this) } />
            }) }
            
            <p>Nearest to..</p>
            <input placeholder="Your postcode" onChange={this.handleChangePostcode.bind(this)}></input>

            { 
            filtered.length ?
            filtered.map( person => { 
                    return <Person key={person.id} person={ person }/>
                })  
            : 
            <p>No results found</p>
            }
        </div>
    }
}

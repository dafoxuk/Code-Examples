import React from 'react'
import axios from 'axios'
const baseURL = 'http://aws.dafox.uk'
import { Link } from 'react-router-dom'
import IndexGoogleMap from './IndexGoogleMap.jsx'
import Review from './Review.jsx'
import PostReview from './PostReview.jsx'


// The Profile Component, showing details
export default class Profile extends React.Component {
    constructor(match) {
        super();
        this.match = match

        this.state = {
            isLoading: true,
            data: [],
            reviews: [],
            postId: 0
        }
    }
    componentDidMount() {
        // Get profile data
        axios.get(baseURL + "/wp-json/wp/v2/gd_person", {
                params: { slug: this.props.match.params.slug }
            })
            .then(response => {
                return response.data
            }).then(data => {
                this.setState({ isLoading: false, data: data, postId: data[0].id })

                // Get reviews, once we know the postId
                axios.get(baseURL + "/wp-json/wp/v2/comments", {
                        params: { post: data[0].id }
                    })
                    .then(response => {
                        return response.data
                    }).then(data => {
                        this.setState({ reviews: data })
                    }).catch(err => {
                        console.log(err)
                    })

            }).catch(err => {
                console.log(err)
            })

    }
    render() {
        const { isLoading, data, reviews } = this.state
        const dataContent = data[0]
        if (isLoading) return <p>Loading...</p>

        return <div>
            <h1>About {dataContent.title.rendered}</h1>
            <IndexGoogleMap 
              isMarkerShown
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDk_InIFxkL0tR_ItwNOq2xkqI8MVIWDSc&v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `400px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
              markerData={data}
            />
            <div dangerouslySetInnerHTML={ { __html: dataContent.content.rendered } } />
            { data.geodir_services ?
                <div>
                    <h3>Services</h3>
                    { dataContent.geodir_services.split(',').map( (service, key) => {
                        return <span key={key}>{service}, </span>
                    }) }
                </div>
                : null
            }
            <div>
                {
                   ( reviews.length ) ? 
                        reviews.map( (review, key) => {
                            return <Review key={key} review={ review } />
                        })
                    : <p>There are no reviews yet</p> 
                }
                <PostReview postId={this.state.postId} />
            </div>
            <p><button>Contact</button></p>
            <p><Link to="/"><button>Back to index</button></Link></p>
        </div>
    }
}

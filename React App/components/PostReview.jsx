import React from 'react'
import axios from 'axios'
const baseURL = 'http://aws.dafox.uk'

// Post a Review Component
export default class PostReview extends React.Component {

    constructor() {
        super();
        this.state = {
            review: {
                content: '',
                name: '',
                email: '',
                rating: 0,
                added: true
            }
        }
    }

    handleChangeReview(event) {
        const { review } = this.state
        review.content = event.target.value
        this.setState({ review: review })
    }

    handleChangeName(event) {
        const { review } = this.state
        review.name = event.target.value
        this.setState({ review: review })
    }

    handleChangeEmail(event) {
        const { review } = this.state
        review.email = event.target.value
        this.setState({ review: review })
    }

    handleChangeRating(event) {
        const { review } = this.state
        review.rating = event.target.value
        this.setState({ review: review })
    }

    handleSubmit(event) {
        event.preventDefault()
        const { review } = this.state

        axios.post(baseURL + "/wp-json/wp/v2/comments", {
                post: this.props.postId,
                author_name: review.name,
                author_email: review.email,
                geodir_overallrating: review.rating,
                content: review.content
            })
            .then(response => {
                return response.data
            }).then(data => {
                this.setState({ review: { added: true } })
            }).catch(err => {
                console.log(err)
            })
    }

    render() {
        const { hasReviewed } = this.state

        if (hasReviewed) {
            return 'Thank you for your review...'
        }

        return <div>
            <form onSubmit={this.handleSubmit.bind(this)}>
                <label>Rating</label><br />
                <input type="number" onChange={this.handleChangeRating.bind(this)} /><br />
                <label>Your name</label><br />
                <input type="text" onChange={this.handleChangeName.bind(this)} /><br />
                <label>Your email</label><br />
                <input type="email" onChange={this.handleChangeEmail.bind(this)} /><br />
                <label>Your review</label> < br / >
                <textarea onChange={this.handleChangeReview.bind(this)}></textarea> < br / >
                <input type="submit" value="Submit" />
            </form>
        </div>
    }
}

import React from 'react'

// The Review Component
const Review = (props) => {
    return <div dangerouslySetInnerHTML={ { __html: props.review.content.rendered } } />
}

export default Review

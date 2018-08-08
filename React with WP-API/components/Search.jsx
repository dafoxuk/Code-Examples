import React from 'react'

// The Search Component
export default class Search extends React.Component {
    render() {
        return <p>
            <input type="text" value={ this.props.keywords } onChange={ this.props.handleChangeSearch } />
            </p>
    }
}

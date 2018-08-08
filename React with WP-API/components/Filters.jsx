import React from 'react'

// The Filters Component
export default class Filters extends React.Component {
    render() {
        return <span>
            <label htmlFor={this.props.service}>{this.props.service}</label><input type="checkbox" name={this.props.service} value={this.props.service} onChange={this.props.onFilter} />
        </span>
    }
}

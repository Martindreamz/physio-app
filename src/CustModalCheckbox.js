import React, { Component } from 'react'

class CustModalCheckbox extends Component {
    constructor() {
        super()
    }
    render() {
        return (
            <div>
               <p> {this.props.customer.Name}</p> 
               Called
                <input
                    type="checkbox"
                    checked={this.props.customer.ticked}
                    onChange={() => this.props.updateCalled(this.props.customer.Id)}
                >
                </input>
            </div>
        )
    }

}
export default CustModalCheckbox
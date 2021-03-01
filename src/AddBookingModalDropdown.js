import React, { Component } from 'react'

class AddBoookingDropdown extends Component {
    constructor() {
        super()
      
    }
    render() {
        return (
            
                <option
                    value={this.props.customer.Id}
                >
                    {this.props.customer.Name}
                </option>
            
        )
    }

}
export default AddBoookingDropdown
import './Modal.css';
import React, { Component } from 'react';
import Modal from 'react-modal'
import axios from 'axios'


class EditBookingModal extends Component {
    constructor(props) {
        super()
        this.state = {
            customers: [],
            modalStartDate: "",
            TimePref: "",
            allCustomers: [],
            selectedCustomer: 0
        }      
        this.deleteBooking = this.deleteBooking.bind(this);
    }

deleteBooking(){
    console.log('deleting',this.props.EditBookingId)
    this.props.onClickFunction()
}

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    componentDidMount() {
   
    }

    render() {
        return (
            <div>
                <Modal
                    isOpen={this.props.isOpen}
                    onRequestClose={() => this.props.onRequestClose()}
                    shouldCloseOnOverlayClick={this.props.shouldCloseOnOverlayClick}>
                    <h1>Customer</h1>
                    <h4>Name: {this.props.EditBookingName}</h4>
                    <h4>Date: {(this.props.EditBookingStartDate).substring(0, 10)}</h4>
                    <h4>Time: {(this.props.EditBookingStartDate).substring(11, 16)} - {(this.props.EditBookingEndDate).substring(11, 16)}</h4>
                    <button onClick={()=>this.props.onClickFunction()}>Ok</button>
                    <button onClick={this.deleteBooking}>Delete</button>
                </Modal>
            </div>
        )
    }
}
export default EditBookingModal



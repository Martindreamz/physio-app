import './Modal.css';
import React, { Component } from 'react';
import Modal from 'react-modal'
import axios from 'axios'
import CustModalCheckbox from './CustModalCheckbox'
import CustModalDropdown from './CustModalDropdown'

class CustModal extends Component {
    constructor(props) {
        super()
        this.state = {
            customers: [],
            modalStartDate: "",
            TimePref: "",
            allCustomers: [],
            selectedCustomer: 0
        }

        this.getCustomers = this.getCustomers.bind(this);
        this.updateCalled = this.updateCalled.bind(this);
        this.getAllCustomers = this.getAllCustomers.bind(this);
        this.updateSelectedCustomer = this.updateSelectedCustomer.bind(this);
        this.postBooking = this.postBooking.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.modalStartDate != this.props.modalStartDate) {
            console.log("modal date changed prevState = " + prevState.modalStartDate + "props modalstartdate = " + this.props.modalStartDate)
            this.setState({ modalStartDate: this.props.modalStartDate })
            console.log("new state start date =" + this.state.modalStartDate)
            this.getCustomers()
        } else {
            console.log("no change")
        }


    }
    getCustomers() {

        // console.log("from component " + this.state.modalStartDate)
        // console.log("from component " + (new Date(this.state.modalStartDate)).getDay())
        let day = ""
        let dayNumber = (new Date(this.props.modalStartDate)).getDay()
        // console.log("day number = " + dayNumber)
        switch (dayNumber) {
            case 0: day = "SUN"; break;
            case 1: day = "MON"; break;
            case 2: day = "TUE"; break;
            case 3: day = "WED"; break;
            case 4: day = "THU"; break;
            case 5: day = "FRI"; break;
            default: day = "SAT"; break;
        }
        // console.log(day)
        // console.log("hours = " + (new Date(this.state.modalStartDate)).getHours())
        let time = (new Date(this.props.modalStartDate)).getHours()
        let hour = ""
        if (time < 10) {
            hour = "EM"
        }
        else if (time >= 10 && time < 12) {
            hour = "LM"
        }
        else if (time >= 12 && time < 16) {
            hour = "EA"

        } else if (time >= 16 && time < 18) {
            hour = "LA"

        } else if (time >= 18 && time < 20) {
            hour = "E"
        } else {
            hour = "N"
        }
        axios.get("https://0q7lvp0ual.execute-api.ap-northeast-2.amazonaws.com/dev/getcustomerbytimepreference?TimePref=" + day + "-" + hour)
            .then(response => {
                console.log(response.data)
                const freshCustomers = response.data.message.Items.map(item => {
                    return {
                        'Id': item.Id,
                        'ticked': false,
                        'Name': item.Name
                    }
                })
                // .map(items => items.Name)
                this.setState({
                    customers: freshCustomers,
                    TimePref: response.data.TimePref,
                })



            })
            .catch(error => console.error(error))

        // console.log("customer list = " + customerlist)
    }
    getAllCustomers() {
        axios.get("https://0q7lvp0ual.execute-api.ap-northeast-2.amazonaws.com/dev/getallcustomers")
            .then(response => {
                // console.log(response.data)
                const freshAllCustomers = response.data.item.Items.map(item => {
                    return {
                        'Id': item.Id,
                        'Name': item.Name
                    }
                })
                console.log("get all custoomers ", freshAllCustomers)
                // .map(items => items.Name)
                this.setState({
                    allCustomers: freshAllCustomers,
                    selectedCustomer: freshAllCustomers[0].Id
                })
            })
            .catch(error => console.error(error))


    }

    updateCalled(id) {
        this.setState(prevState => {
            const updatedCustomers = prevState.customers.map(customer => {
                if (customer.Id === id) {
                    console.log("hit")
                    return {
                        ...customer,
                        ticked: !customer.ticked
                    }
                } return customer
            })
            console.log("update clicked")
            console.log(prevState.customers)
            console.log(updatedCustomers)
            return {
                customers: updatedCustomers
            }

        })
    }

    updateSelectedCustomer(event) {
        console.log("checking type", event.target.value)
        this.setState({ selectedCustomer: event.target.value })
        console.log("event changed to", this.state.selectedCustomer)
    }

    postBooking() {
        const StartDate = ((new Date(this.props.modalStartDate)).getTime() / 1000);
        console.log(StartDate)
        const EndDate = ((new Date(this.props.modalEndDate)).getTime() / 1000);
        console.log(EndDate)
        const customer = this.state.selectedCustomer
        axios.post("https://0q7lvp0ual.execute-api.ap-northeast-2.amazonaws.com/dev/putnewbooking?StartTime=" + StartDate + "&EndTime=" + EndDate + "&CustId=" + customer)
            .then(function (response) {
                console.log(response);
            })


        this.props.onClickFunction();
    }
    componentDidMount() {
        this.getCustomers()
        this.getAllCustomers()
    }

    render() {
        console.log("inside render customers = " + this.state.customers)
        const torender = this.state.customers.map(item =>
            // console.log(item.Id+" "+item.Name))
            <CustModalCheckbox
                key={item.Id}
                customer={item}
                updateCalled={this.updateCalled} />
        )
        const selectionToRender = this.state.allCustomers.map(customer =>
            <CustModalDropdown
                key={customer.Id}
                customer={customer} />
        )
        return (

            <div>
                <Modal
                    isOpen={this.props.isOpen}
                    onRequestClose={() => this.props.showModal}
                    shouldCLooseOnOverlayClick={() => this.props.hideModal}>
                    <h1>New Booking</h1>
                    <h4>Date: {(this.props.modalStartDate).substring(0, 10)}</h4>
                    <h4>Start time: {(this.props.modalStartDate).substring(11, 16)} - {(this.props.modalEndDate).substring(11, 16)}</h4>
                    <h2>Select a customer to book below</h2>
                    <div>
                        {torender}
                    </div>
                    <br></br>
                    <div>
                        <table>
                            <tr>

                                <select
                                    value={this.state.selectedCustomer}
                                    onChange={this.updateSelectedCustomer}
                                >
                                    {selectionToRender}
                                </select>

                            </tr>
                            <td>
                                <button onClick={this.postBooking}>Confirm</button>

                            </td><td>

                                <button onClick={() => this.props.onClickFunction()}>Close</button>
                            </td>

                        </table>

                    </div>

                </Modal>
            </div>
        )
    }
}
export default CustModal



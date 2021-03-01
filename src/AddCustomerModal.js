import './Modal.css';
import React, { Component } from 'react';
import Modal from 'react-modal'
import axios from 'axios'

let EMslot = ["SUN-EM", "MON-EM", "TUE-EM", "WED-EM", "THU-EM", "FRI-EM", "SAT-EM"];
let LMslot = ["SUN-LM", "MON-LM", "TUE-LM", "WED-LM", "THU-LM", "FRI-LM", "SAT-LM"];
let EAslot = ["SUN-EA", "MON-EA", "TUE-EA", "WED-EA", "THU-EA", "FRI-EA", "SAT-EA"];
let LAslot = ["SUN-LA", "MON-LA", "TUE-LA", "WED-LA", "THU-LA", "FRI-LA", "SAT-LA"];
let Eslot = ["SUN-E", "MON-E", "TUE-E", "WED-E", "THU-E", "FRI-E", "SAT-E"];
let Nslot = ["SUN-N", "MON-N", "TUE-N", "WED-N", "THU-N", "FRI-N", "SAT-N"];
let defaultCustomer = {
    "FRI-E": false,
    "FRI-EA": false,
    "FRI-EM": false,
    "FRI-LA": false,
    "FRI-LM": false,
    "FRI-N": false,
    "MON-E": false,
    "MON-EA": false,
    "MON-EM": false,
    "MON-LA": false,
    "MON-LM": false,
    "MON-N": false,
    "SAT-E": false,
    "SAT-EA": false,
    "SAT-EM": false,
    "SAT-LA": false,
    "SAT-LM": false,
    "SAT-N": false,
    "SUN-E": false,
    "SUN-EA": false,
    "SUN-EM": false,
    "SUN-LA": false,
    "SUN-LM": false,
    "SUN-N": false,
    "THU-E": false,
    "THU-EA": false,
    "THU-EM": false,
    "THU-LA": false,
    "THU-LM": false,
    "THU-N": false,
    "TUE-E": false,
    "TUE-EA": false,
    "TUE-EM": false,
    "TUE-LA": false,
    "TUE-LM": false,
    "TUE-N": false,
    "WED-E": false,
    "WED-EA": false,
    "WED-EM": false,
    "WED-LA": false,
    "WED-LM": false,
    "WED-N": false,
    Name: ""
}
class AddCustomerModal extends Component {
    constructor(props) {
        super()

        this.state = {
            customer: defaultCustomer
        }

        this.slotChanged = this.slotChanged.bind(this);
        this.postCustomer = this.postCustomer.bind(this);
        this.nameChanged = this.nameChanged.bind(this);
    }

    slotChanged(slot) {
        console.log("slot changed", this.state.customer[slot])
        // this.setState(prevState=>{
        //     console.log(prevState[slot],slot)
        //     console.log(prevState[slot]!=this.state[slot])
        //     if(prevState[slot]!=this.state[slot]){
        //      return   this.state[slot] = !prevState[slot]
        //     }
        // })   
        // this.setState({[slot]:!this.state[slot]})
        const newCustomer = {
            ...this.state.customer,
            [slot]: !this.state.customer[slot]
        }
        this.setState({ customer: newCustomer })
    }
    nameChanged(event){
        console.log("name changed",this.state.customer['Name'])
        const newCustomer = {
            ...this.state.customer,
            Name: event.target.value
        }
        this.setState({ customer: newCustomer })
    }

    postCustomer() {
        console.log(this.state.customer)
        this.props.onClickFunction()
        this.setState({
            customer: defaultCustomer
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    componentDidMount() {

    }

    render() {
        let EMrenders = EMslot.map(slot =>
            <td>
                <input
                    type="checkbox"
                    checked={this.state.customer[slot]}
                    onChange={() => this.slotChanged(slot)} />
            </td>
        )
        let LMrenders = LMslot.map(slot =>
            <td>
                <input
                    type="checkbox"
                    checked={this.state.customer[slot]}
                    onChange={() => this.slotChanged(slot)} />
            </td>
        )
        let EArenders = EAslot.map(slot =>
            <td>
                <input
                    type="checkbox"
                    checked={this.state.customer[slot]}
                    onChange={() => this.slotChanged(slot)} />
            </td>
        )
        let LArenders = LAslot.map(slot =>
            <td>
                <input
                    type="checkbox"
                    checked={this.state.customer[slot]}
                    onChange={() => this.slotChanged(slot)} />
            </td>
        )
        let Erenders = Eslot.map(slot =>
            <td>
                <input
                    type="checkbox"
                    checked={this.state.customer[slot]}
                    onChange={() => this.slotChanged(slot)} />
            </td>
        )
        let Nrenders = Nslot.map(slot =>
            <td>
                <input
                    type="checkbox"
                    checked={this.state.customer[slot]}
                    onChange={() => this.slotChanged(slot)} />
            </td>
        )


        return (
            <div>
                <Modal
                    isOpen={this.props.isOpen}
                    onRequestClose={() => this.props.showModal}
                    shouldCloseOnOverlayClick={() => this.props.hideModal}>
                    <h1>New Customer</h1>
                    <h4>Name: </h4> <input type="text" onChange={this.nameChanged}/>
                    <h4>Time Pref: </h4>
                    <table border="1px">
                        <thead>
                            <tr>
                                <td>Hour Preference \ Day</td><td>Sunday</td><td>Monday</td><td>Tuesday</td><td>Wednesday</td><td>Thursday</td><td>Friday</td><td>Saturday</td>
                            </tr>
                        </thead>
                        <tbody>

                            <tr>
                                <td>Early Morning</td>{EMrenders}
                            </tr>
                            <tr>
                                <td>Late Morning</td>{LMrenders}
                            </tr>
                            <tr>
                                <td>Early Afternoon</td>{EArenders}
                            </tr>
                            <tr>
                                <td>Late Afternoon</td>{LArenders}
                            </tr>
                            <tr>
                                <td>Evening</td>{Erenders}
                            </tr>
                            <tr>
                                <td>Night</td>{Nrenders}
                            </tr>
                        </tbody>
                    </table>

                    <button onClick={this.postCustomer}>Confirm</button>
                    <button onClick={() => this.props.onClickFunction()}>Close</button>
                </Modal>
            </div>
        )
    }
}
export default AddCustomerModal



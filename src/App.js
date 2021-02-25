import React, { Component } from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "daypilot-pro-react";
import "./CalendarStyles.css";
import axios from 'axios';
import Modal from 'react-modal'
import CustModal from './CustModal'
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

Modal.setAppElement('#root')

//coming from laptop
const styles = {
  wrap: {
    display: "flex"
  },
  left: {
    marginRight: "10px"
  },
  main: {
    flexGrow: "1"
  }
};

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewType: "Week",
      durationBarVisible: false,
      timeRangeSelectedHandling: "Enabled",
      onTimeRangeSelected: args => {
        this.calendar.clearSelection();
        // console.log(typeof(args.start)+" "+ args.start)
        // console.log(typeof(args.end)+" "+ args.end)      
        // console.log(args.end.value)      

        this.setState({
          modalStartDate: args.start.value,
          modalEndDate: args.end.value,
          isOpen: true
        })
        // DayPilot.Modal.prompt("Create a new event hello:", "Event 1").then(function (modal) {
        //   dp.clearSelection();
        //   if (!modal.result) { return; }
        //   dp.events.add(new DayPilot.Event({
        //     start: args.start,
        //     end: args.end,
        //     id: DayPilot.guid(),
        //     text: modal.result
        //   }));
        // });
      },
      // onTimeRangeSelected: args => {
      // <Modal 
      // isOpen={this.state.isOpen}
      // onRequestClose={this.showModal}
      // shouldCLooseOnOverlayClick={this.hideModal}>
      //     <h1>Modal Title</h1>
      //     <h2>Modal Body</h2>
      //     <button onClick={this.hideModal}></button>
      // </Modal>
      // },
      eventDeleteHandling: "Update",
      onEventClick: args => {
        let dp = this.calendar;
        DayPilot.Modal.prompt("Update event text:", args.e.text()).then(function (modal) {
          if (!modal.result) { return; }
          args.e.data.text = modal.result;
          dp.events.update(args.e);
        });
      },
      events: [],
      isOpen: false,
      modalStartDate: "",
      modalEndDate: ""
    };

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.dateFormatter = this.dateFormatter.bind(this);
    this.getAllBookings = this.getAllBookings.bind(this);
  }

  showModal = () => {
    this.setState({ isOpen: true });
    this.getAllBookings();
    // console.log("i am clicked")
  };

  hideModal = () => {
    this.setState({ isOpen: false });
    this.getAllBookings();
    // console.log("i am clicked")
  };

  dateFormatter(input) {
    let st = new Date(input * 1000)
    // Hours part from the timestamp
    var year = st.getFullYear()
    var month = (st.getMonth() + 1) < 10 ? ("0" + (st.getMonth() + 1)) : (st.getMonth() + 1);
    var day = (st.getDate()) < 10 ? ("0" + (st.getDate())) : (st.getDate());
    var hour = st.getHours() < 10 ? "0" + st.getHours() : st.getHours()
    var minute = st.getMinutes() < 10 ? "0" + st.getMinutes() : st.getMinutes()
    var second = st.getSeconds() < 10 ? "0" + st.getSeconds() : st.getSeconds()
    // Minutes part from the timestamp
    // Seconds part from the timestamp
    let out = year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second
    // console.log(out)
    return out
  }
  getAllBookings() { //change this to per month instead of per current week
    let today = new Date();
    let dateNumber = today.getDay();
    let lastSunday = today.setDate(today.getDate() - dateNumber)
    let lastSundayDate = new Date(lastSunday)
    let lastSunDateTime = this.dateFormatter(lastSundayDate / 1000).substring(0, 10) + "T00:00:00.000Z"
    console.log("last sundate", lastSunDateTime)
    let nextSaturday = lastSundayDate.setDate(lastSundayDate.getDate() + 6)
    let nextSaturdayDate = new Date(nextSaturday)
    let nextSaturDateTime = this.dateFormatter(nextSaturdayDate / 1000).substring(0, 10) + "T00:00:00.000Z"
    console.log("next saturdate", nextSaturDateTime)


    let sundayToSend = ((new Date(lastSunDateTime)) / 1000 + 3600 * 7)
    let saturdayToSend = ((new Date(nextSaturDateTime)) / 1000 + 3600 * 7)
    console.log("sundayToSend", sundayToSend, "saturdayToSend", saturdayToSend)
    axios.get("https://0q7lvp0ual.execute-api.ap-northeast-2.amazonaws.com/dev/getbookingbystarttimeandendtime?StartTime=" + sundayToSend + "&EndTime=" + saturdayToSend)
      .then(response => {
        console.log(response.data)
        const thisEvents = response.data.message1.Items.map(items => {
          return {
            'id': items.ID,
            'text': items.CustId,
            'start': this.dateFormatter(items.StartTime),
            'end': this.dateFormatter(items.EndTime)
          }
        })
        // console.log(thisEvents)
        this.setState({ events: thisEvents })
      })
      .catch(error => console.error(error))
  }
  componentDidMount() {
    this.getAllBookings()
    let today = new Date();
    let unix_timestamp = Math.round(((today).getTime()) + 3600 * 7) / 1000

    var date = new Date(unix_timestamp * 1000);
    var day = (date.getDate()) < 10 ? ("0" + (date.getDate())) : (date.getDate());
    var month = (date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);
    var year = date.getFullYear()
    // console.log(year, month, day);


    var thisweek = year + "-" + month + "-" + day;
    // console.log(thisweek);
    // load event data
    this.setState({
      startDate: thisweek,
    });
  }

  render() {
    var { ...config } = this.state;
    return (
      <div>
        <AmplifySignOut/>
        <div>
          {/* <Modal 
            isOpen={this.state.isOpen}
            onRequestClose={this.showModal}
            shouldCLooseOnOverlayClick={this.hideModal}>
                <h1>Modal Title</h1>
                <h2>Modal Body</h2>
                <h4>Start date {this.state.modalStartDate}</h4>
                <h4>End date {this.state.modalEndDate}</h4>
                <button onClick={this.hideModal}></button>
            </Modal> */}
          <CustModal
            isOpen={this.state.isOpen}
            onRequestClose={this.showModal}
            shouldCLooseOnOverlayClick={this.hideModal}
            onClickFunction={this.hideModal}
            modalStartDate={this.state.modalStartDate}
            modalEndDate={this.state.modalEndDate} />
        </div>
        <button onClick={this.showModal}>
          Open
        </button>
        <div style={styles.wrap}>
          <div style={styles.left}>
            <DayPilotNavigator
              selectMode={"week"}
              showMonths={2}
              skipMonths={2}
              onTimeRangeSelected={args => {
                this.setState({
                  startDate: args.day
                });
              }}
            />
          </div>
          <div style={styles.main}>
            <DayPilotCalendar
              {...config}
              ref={component => {
                this.calendar = component && component.control;
              }}
            />
          </div>
        </div></div>
    );
  }
}

export default withAuthenticator(App);
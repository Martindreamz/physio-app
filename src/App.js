import React, { Component } from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "daypilot-pro-react";
import "./CalendarStyles.css";
import axios from 'axios';
import Modal from 'react-modal'
import AddBookingModal from './AddBookingModal'
import AddCustomerModal from './AddCustomerModal'
import EditBookingModal from './EditBookingModal'
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

Modal.setAppElement('#root')

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
        this.setState({
          modalStartDate: args.start.value,
          modalEndDate: args.end.value,
          isBookingModalOpen: true
        })

      },
      onEventClick: args => {
        this.setState({
          EditBookingStartDate: args.e.data.start.value,
          EditBookingEndDate: args.e.data.end.value,
        EditBookingName:args.e.data.text,
        EditBookingId:args.e.data.id,
          isEditBookingModalOpen: true
        })
      },
      events: [],
      isBookingModalOpen: false,
      isCustomerModalOpen:false,
      modalStartDate: "",
      modalEndDate: "",
      isEditBookingModalOpen:false,
      EditBookingStartDate:"",
      EditBookingEndDate:"",
      EditBookingId:"",
      EditBookingName:""
    };

    this.showBookingModal = this.showBookingModal.bind(this);
    this.hideBookingModal = this.hideBookingModal.bind(this);
    this.showCustomerModal = this.showCustomerModal.bind(this);
    this.hideCustomerModal = this.hideCustomerModal.bind(this);
    this.showEditBookingModal=this.showEditBookingModal.bind(this);
    this.hideEditBookingModal = this.hideEditBookingModal.bind(this);
    this.dateFormatter = this.dateFormatter.bind(this);
    this.getAllBookings = this.getAllBookings.bind(this);
  }

  showBookingModal = () => {
    this.setState({ isBookingModalOpen: true });
    this.getAllBookings();
    console.log("showBookingModal clicked")
  };

  hideBookingModal = () => {
    this.setState({ isBookingModalOpen: false });

    this.getAllBookings();
    console.log("hideBookingModal clicked")
  };

  showCustomerModal = () => {
    this.setState({ isCustomerModalOpen: true });
    console.log("showCustomerModal clicked")
  };

  hideCustomerModal = () => {
    this.setState({ isCustomerModalOpen: false });    
    console.log("hideCustomerModal clicked")
  };
  
  showEditBookingModal = () => {
    this.setState({ isEditBookingModalOpen: true });
    console.log("showEditBookingModal clicked")
  };

  hideEditBookingModal = () => {
    this.setState({ isEditBookingModalOpen: false });    
    console.log("hideEditBookingModal clicked")
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
    let monthNumber = today.getMonth();
    let yearNumber = today.getFullYear();
    let lastSunday = today.setDate(today.getDate() - dateNumber)
    let lastSundayDate = new Date(lastSunday)
    let lastSunDateTime = this.dateFormatter(lastSundayDate / 1000).substring(0, 10) + "T00:00:00.000Z"
    // console.log("last sundate", lastSunDateTime)
    let nextSaturday = lastSundayDate.setDate(lastSundayDate.getDate() + 6)
    let nextSaturdayDate = new Date(nextSaturday)
    let nextSaturDateTime = this.dateFormatter(nextSaturdayDate / 1000).substring(0, 10) + "T00:00:00.000Z"
    // console.log("next saturdate", nextSaturDateTime)
    switch (monthNumber) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12: dateNumber = 31; break;
      case 2: dateNumber = yearNumber % 4 == 0 ? 29 : 28
      default: dateNumber = 30; break;
    }

    lastSunDateTime = this.dateFormatter(new Date(yearNumber, monthNumber, 1) / 1000).substring(0, 10) + "T00:00:00.000Z"
    // console.log("last sundate", lastSunDateTime)

    nextSaturDateTime = this.dateFormatter(new Date(yearNumber, monthNumber, dateNumber) / 1000).substring(0, 10) + "T00:00:00.000Z"
    // console.log("next saturdate", nextSaturDateTime)

    let sundayToSend = ((new Date(lastSunDateTime)) / 1000 + 3600 * 7)
    let saturdayToSend = ((new Date(nextSaturDateTime)) / 1000 + 3600 * 7)


    // console.log("sundayToSend", sundayToSend, "saturdayToSend", saturdayToSend)
    axios.get("https://0q7lvp0ual.execute-api.ap-northeast-2.amazonaws.com/dev/getbookingbystarttimeandendtime?StartTime=" + sundayToSend + "&EndTime=" + saturdayToSend)
      .then(response => {
        // console.log(response.data)
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.events != this.state.events) {
        console.log("events added, now have ", this.state.events.length)
        this.setState({ events: this.state.events })
    } else {
        console.log("no change")
    }
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
        <div>
          <AddCustomerModal
            isOpen={this.state.isCustomerModalOpen}
            onRequestClose={this.showCustomerModal}
            shouldCLooseOnOverlayClick={this.hideCustomerModal}
            onClickFunction={this.hideCustomerModal}
          />
          <EditBookingModal
            isOpen={this.state.isEditBookingModalOpen}
            onRequestClose={this.hideEditBookingModal}
            shouldCloseOnOverlayClick={false}
            onClickFunction={this.hideEditBookingModal}
            EditBookingStartDate={this.state.EditBookingStartDate}
            EditBookingEndDate={this.state.EditBookingEndDate}
            EditBookingName={this.state.EditBookingName}
            EditBookingId={this.state.EditBookingId}
          />
          <AddBookingModal
            isOpen={this.state.isBookingModalOpen}
            onRequestClose={this.showBookingModal}
            shouldCLooseOnOverlayClick={this.hideBookingModal}
            onClickFunction={this.hideBookingModal}
            modalStartDate={this.state.modalStartDate}
            getAllBookings={this.getAllBookings}
            modalEndDate={this.state.modalEndDate} />
        </div>
        <button onClick={this.showCustomerModal}>
          Add New Customer
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
            <AmplifySignOut />
          </div>
        </div></div>
    );
  }
}

export default withAuthenticator(App);
// export default App;
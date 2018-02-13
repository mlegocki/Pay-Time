/* global chrome */
import React, { Component } from 'react';
import { Button } from 'semantic-ui-react'
import logo from './Pay-Time.png';
import './App.css';
import Bill from './Bill';
import ListBillSmall from './ListBill-Small';
import ListBillLarge from './ListBill-Large';

class App extends Component {
  constructor() {
    super();
    this.state = {
      billList: {},
      currentBill: {
        billKey: '',
        billType: '',
        companyOwed: '',
        frequency: '',
        specificDate: 0,
      },
      displaySmallList: true,   // if false, will display large list
      displayBill: false,
    }
    this.deleteBill = this.deleteBill.bind(this);
    this.updateBillList = this.updateBillList.bind(this);
    this.toggleBillDisplay = this.toggleBillDisplay.bind(this);
    this.toggleListSize = this.toggleListSize.bind(this);
  }

  componentDidMount() {
    chrome.storage.sync.get(null, (data) => {
      this.setState({ billList: data })
    });
  }

  deleteBill(billKey) {
    chrome.storage.sync.remove(billKey)
    this.setState({
      currentBill: {
        billKey: '',
        billType: '',
        companyOwed: '',
        frequency: '',
        specificDate: 0,
      }
    });
  }
  updateBillList(billKey) {
    if (billKey) this.deleteBill(billKey);
    chrome.storage.sync.get(null, (data) => {
      console.log('New Data Entry:', data);
      this.setState({ billList: data })
    });
    this.setState({
      currentBill: {
        billKey: '',
        billType: '',
        companyOwed: '',
        frequency: '',
        specificDate: 0,
      }
    });
  }
  toggleBillDisplay(bill) {
    if (bill) this.setState({ currentBill: bill });
    this.state.displayBill ? this.setState({ displayBill: false }) : this.setState({ displayBill: true });
  }
  toggleListSize() {
    this.state.displaySmallList ? this.setState({ displaySmallList: false }) : this.setState({ displaySmallList: true });
  }
  render() {
    const { billList, currentBill, displayBill, displaySmallList } = this.state;
    return (
      <div className={`master-container-${displaySmallList}`}>
        <header className="App-header">
          <img src={logo} className="App-logo" />
          <h1 className="App-title">Welcome to Pay Time</h1>
        </header>
        {
          this.state.displaySmallList &&
          <ListBillSmall billList={billList} deleteBill={this.deleteBill} toggleBillDisplay={this.toggleBillDisplay} updateBillList={this.updateBillList} />
        }
        {
          !this.state.displaySmallList &&
          <ListBillLarge billList={billList} deleteBill={this.deleteBill} toggleBillDisplay={this.toggleBillDisplay} updateBillList={this.updateBillList} />
        }
        <Bill displayBill={displayBill} currentBill={currentBill} deleteBill={this.deleteBill} toggleBillDisplay={this.toggleBillDisplay} updateBillList={this.updateBillList} />
        <Button color='purple' onClick={() => this.toggleBillDisplay()}>
          Add Bill Reminder
        </Button>
        {
          this.state.displaySmallList &&
          <Button color='black' onClick={this.toggleListSize}>
            Display Detailed List
          </Button>
        }
        {
          !this.state.displaySmallList &&
          <Button color='black' onClick={this.toggleListSize}>
            Display Condensed List
          </Button>
        }

      </div>
    );
  }
}

export default App;
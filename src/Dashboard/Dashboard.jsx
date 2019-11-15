import React, { Component } from 'react';
import T from 'prop-types';
import shortid from 'shortid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from './Dashboard.module.css';
import Controls from '../Controls/Controls';
import Balance from '../Balance/Balance';
import TransactionHistory from '../TransactionHistory/TransactionHistory';

export default class Dashboard extends Component {
  static defaultProps = {
    id: shortid.generate(),
    type: '',
    amount: 0,
    date: new Date().toLocaleString(),
    messageNotEnoughMoney:
      'На счету недостаточно средств для проведения операции!',
    messageInvalidAmount: 'Введите сумму для проведения операции!',
  };

  static propTypes = {
    id: T.string,
    type: T.string,
    amount: T.number,
    date: T.string,
    messageNotEnoughMoney: T.string,
    messageInvalidAmount: T.string,
  };

  state = {
    transactions: [],
    balance: 0,
  };

  notifyInvalid = () =>
    toast(this.props.messageInvalidAmount, {
      position: toast.POSITION.TOP_CENTER,
    });

  notifyNotEnough = () =>
    toast(this.props.messageNotEnoughMoney, {
      position: toast.POSITION.TOP_CENTER,
    });

  handleInputText = e => {
    this.setState({
      inputAmount: e.currentTarget.value,
    });
  };

  reset = () => {
    this.setState({
      inputAmount: '',
    });
  };

  handleDeposit = () => {
    return this.state.inputAmount > 0
      ? (this.setState(prevState => ({
          balance: (this.state.balance =
            prevState.balance + Number.parseInt(this.state.inputAmount)),
          transactions: (this.state.transactions = [
            ...this.state.transactions,
            {
              type: 'deposit',
              amount: Number.parseInt(this.state.inputAmount),
              date: new Date().toLocaleString(),
              id: shortid.generate(),
            },
          ]),
        })),
        this.reset())
      : (this.reset(), this.notifyInvalid());
  };

  handleWithdraw = () => {
    return this.state.inputAmount === '0' ||
      this.state.inputAmount === '' ||
      this.state.inputAmount < 0
      ? (this.notifyInvalid(), this.reset())
      : this.state.inputAmount >= 0 &&
        this.state.inputAmount <= this.state.balance
      ? (this.setState(prevState => ({
          balance: (this.state.balance =
            prevState.balance - Number.parseInt(this.state.inputAmount)),
          transactions: (this.state.transactions = [
            ...this.state.transactions,
            {
              type: 'withdraw',
              amount: Number.parseInt(this.state.inputAmount),
              date: new Date().toLocaleString(),
              id: shortid.generate(),
            },
          ]),
        })),
        this.reset())
      : (this.notifyNotEnough(), this.reset());
  };

  render() {
    return (
      <div className={styles.dashboard}>
        <Controls
          inputAmount={this.state.inputAmount}
          onChangeInput={this.handleInputText}
          onDeposit={this.handleDeposit}
          onWithdraw={this.handleWithdraw}
        />
        <Balance
          transactions={this.state.transactions}
          balance={this.state.balance}
        />
        <TransactionHistory items={this.state.transactions} />
        <ToastContainer />
      </div>
    );
  }
}

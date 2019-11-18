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
    income: 0,
    expenses: 0,
  };

  inOut = (transactions, num) => {
    console.log(num);
    num === 'income'
      ? (this.income = transactions.reduce((acc, transaction) => {
          acc = acc + transaction.amount;
          return acc;
        }, 0))
      : (this.expenses = transactions.reduce((acc, transaction) => {
          acc = acc + transaction.amount;
          return acc;
        }, 0));
    return num;
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

  handleDepositWithdraw = ({ target: { name } }) => {
    this.setState(prevState => ({
      balance:
        name === 'deposit'
          ? prevState.balance + Number.parseInt(this.state.inputAmount)
          : prevState.balance - Number.parseInt(this.state.inputAmount),

      income:
        name === 'deposit'
          ? prevState.income + Number.parseInt(this.state.inputAmount)
          : prevState.income,

      expenses:
        name === 'withdraw'
          ? prevState.expenses + Number.parseInt(this.state.inputAmount)
          : prevState.expenses,

      transactions: (this.state.transactions = [
        ...this.state.transactions,
        {
          type: name,
          amount: Number.parseInt(this.state.inputAmount),
          date: new Date().toLocaleString(),
          id: shortid.generate(),
        },
      ]),
    }));
    this.reset();
  };

  handleDeposit = ({ target: { name } }) => {
    return this.state.inputAmount > 0
      ? this.handleDepositWithdraw({ target: { name } })
      : (this.reset(), this.notifyInvalid());
  };

  handleWithdraw = ({ target: { name } }) => {
    return this.state.inputAmount === '0' ||
      this.state.inputAmount === '' ||
      this.state.inputAmount < 0
      ? (this.notifyInvalid(), this.reset())
      : this.state.inputAmount >= 0 &&
        this.state.inputAmount <= this.state.balance
      ? this.handleDepositWithdraw({ target: { name } })
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
          income={this.state.income}
          expenses={this.state.expenses}
        />
        <TransactionHistory items={this.state.transactions} />
        <ToastContainer />
      </div>
    );
  }
}

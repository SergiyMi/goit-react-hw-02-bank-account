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

  Money = transacs => {
    return transacs.reduce(
      (acc, transaction) => {
        return {
          ...acc,
          [transaction.type]: transaction.amount + acc[transaction.type],
        };
      },
      { deposit: 0, withdraw: 0 },
    );
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
    const { inputAmount } = this.state;
    this.setState(prevState => ({
      balance:
        name === 'deposit'
          ? prevState.balance + Number.parseInt(inputAmount)
          : prevState.balance - Number.parseInt(inputAmount),

      transactions: (this.state.transactions = [
        ...this.state.transactions,
        {
          type: name,
          amount: Number.parseInt(inputAmount),
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
    const { inputAmount, balance } = this.state;
    return inputAmount === '0' || inputAmount === '' || inputAmount < 0
      ? (this.notifyInvalid(), this.reset())
      : inputAmount >= 0 && inputAmount <= balance
      ? this.handleDepositWithdraw({ target: { name } })
      : (this.notifyNotEnough(), this.reset());
  };

  render() {
    const depWit = this.Money(this.state.transactions);
    const { inputAmount, transactions, balance } = this.state;
    return (
      <div className={styles.dashboard}>
        <Controls
          inputAmount={inputAmount}
          onChangeInput={this.handleInputText}
          onDeposit={this.handleDeposit}
          onWithdraw={this.handleWithdraw}
        />
        <Balance
          transactions={transactions}
          balance={balance}
          income={depWit !== undefined ? depWit.deposit : '0'}
          expenses={depWit !== undefined ? depWit.withdraw : '0'}
        />
        <TransactionHistory items={transactions} />
        <ToastContainer />
      </div>
    );
  }
}

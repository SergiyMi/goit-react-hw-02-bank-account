import React, {Component} from 'react';
import T from 'prop-types';
import shortid from 'shortid';

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
        messageNotEnoughMoney: 'На счету недостаточно средств для проведения операции!',
        messageInvalidAmount: 'Введите сумму для проведения операции!'
    }

    static propTypes = {
        id: T.string,
        type: T.string,
        amount: T.number,
        date: T.string,
        messageNotEnoughMoney: T.string,
        messageInvalidAmount: T.string
    }

    state = {
        transactions: [],
        balance: 0,
        inputAmount: '',
        type: '',
        date: new Date().toLocaleString()
    }

    handleInputText = (e) => {
        this.setState(
            {
                inputAmount: e.currentTarget.value
            }
        )
    }

    handleDeposit = () => {
        return (
            this.state.inputAmount > 0 ? 
            this.setState((prevState) => ({
                balance: (
                    this.state.balance = 
                    prevState.balance + Number.parseInt(this.state.inputAmount)
                ),
                transactions: (
                    this.state.transactions = [
                        ...this.state.transactions,
                        {
                            type: "deposit",
                            amount: Number.parseInt(this.state.inputAmount),
                            date: new Date().toLocaleString(),
                            id: shortid.generate()
                        }
                    ]
                )          
                })) 
            : 
                alert(this.props.messageInvalidAmount)
        )         
    }

    handleWithdraw = () => {
        return (
            ((this.state.inputAmount > 0) && (this.state.inputAmount < this.state.balance)) ?
            this.setState((prevState) => ({
                balance: (
                    this.state.balance = prevState.balance - Number.parseInt(this.state.inputAmount)
                ),
                transactions: (
                    this.state.transactions = [
                        ...this.state.transactions,
                        {
                            type: "withdraw",
                            amount: Number.parseInt(this.state.inputAmount),
                            date: new Date().toLocaleString(),
                            id: shortid.generate()
                        }
                    ]
                )            
                }))
            :
                alert(this.props.messageNotEnoughMoney) 
        )
    }

    render() {
        return (
            <div className={styles.dashboard}>
            <Controls inputAmount={this.state.inputAmount} 
            onChangeInput={this.handleInputText}
            onDeposit={this.handleDeposit}
            onWithdraw={this.handleWithdraw}
            />
            <Balance 
            transactions={this.state.transactions}
            balance={this.state.balance}
            />
            <TransactionHistory items={this.state.transactions}/>
        </div>
        )
    }

}
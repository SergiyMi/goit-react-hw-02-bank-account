import React from 'react';

import styles from './Balance.module.css';

const income = (transactions) => {
    let sum = transactions.reduce((acc, transaction) => {
        if (transaction.type!=="deposit") {
            return acc; 
        } 
        else {
            acc = acc + transaction.amount;
            return acc;
        }
    }, 0)
    return sum; 
}

const expenses = (transactions) => {
    let sum = transactions.reduce((acc, transaction) => {
        if (transaction.type!=="withdraw") {
            return acc; 
        } 
        else {
            acc = acc + transaction.amount;
            return acc;
        }
    }, 0)
    return sum; 
}

const Balance = ({transactions, balance}) => {
    return (
        <section className={styles.balance}>
            {
                transactions.length > 0 ? 
                    <>
                    <span>⬆️{income(transactions)}$</span>
                    <span>⬇️{expenses(transactions)}$</span>
                    <span>Balance: {balance}$</span> 
                    </>
                :
                    <>
                    <span>⬆️0$</span>
                    <span>⬇️0$</span>
                    <span>Balance: 0$</span>
                    </>
            }
        </section>
    )
}


export default Balance;
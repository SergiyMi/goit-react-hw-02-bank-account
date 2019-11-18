import React from 'react';

import styles from './Balance.module.css';

const Balance = ({ transactions, balance, income, expenses }) => {
  return (
    <section className={styles.balance}>
      {transactions.length > 0 ? (
        <>
          <span>⬆️{income}$</span>
          <span>⬇️{expenses}$</span>
          <span>Balance: {balance}$</span>
        </>
      ) : (
        <>
          <span>⬆️0$</span>
          <span>⬇️0$</span>
          <span>Balance: 0$</span>
        </>
      )}
    </section>
  );
};

export default Balance;

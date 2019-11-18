import React from 'react';

import styles from './Controls.module.css';

const Controls = ({ inputAmount, onDeposit, onWithdraw, onChangeInput }) => {
  return (
    <section className={styles.controls}>
      <input
        type="number"
        name="amount"
        value={inputAmount}
        onChange={onChangeInput}
      />
      <button type="button" name="deposit" onClick={onDeposit}>
        Deposit
      </button>
      <button type="button" name="withdraw" onClick={onWithdraw}>
        Withdraw
      </button>
    </section>
  );
};

export default Controls;

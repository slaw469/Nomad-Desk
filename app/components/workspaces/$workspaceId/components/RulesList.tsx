import React from 'react';
import styles from '../../workspace.module.css';

interface Rule {
  text: string;
}

interface RulesListProps {
  rules: Rule[];
}

export default function RulesList({ rules }: RulesListProps) {
  return (
    <div className={styles.rulesList}>
      {rules.map((rule, index) => (
        <div key={index} className={styles.ruleItem}>
          <div className={styles.ruleIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.24 12.24C21.3658 11.1142 21.9983 9.58722 21.9983 7.99504C21.9983 6.40285 21.3658 4.87588 20.24 3.75004C19.1142 2.62419 17.5872 1.9917 15.995 1.9917C14.4028 1.9917 12.8758 2.62419 11.75 3.75004L5 10.5V19H13.5L20.24 12.24Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 8L2 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.5 15H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span>{rule.text}</span>
        </div>
      ))}
    </div>
  );
}
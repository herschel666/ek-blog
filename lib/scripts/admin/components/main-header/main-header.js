import React from 'react';

import styles from './main-header.css';

export const MainHeader = () => (
  <header className={styles.header}>
    <div>
      <a href={__blog__.baseUrl} target="_blank">
        Visit blog
      </a>
    </div>
    <form method="post" action={`${__blog__.baseUrl}admin`}>
      <input type="hidden" name="action" value="logout" />
      <button>Logout</button>
    </form>
  </header>
);

import React, { useEffect, useState } from 'react';
import styles from './CrewList.module.css';
import client from '../../../api/feathers';

const CrewList = () => {
  const [crew, setCrew] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.service('crew').find()
      .then(res => {
        setCrew(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching crew:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.card}>
      <div className={styles.title}>Top Crew Based on Sales</div>
      <div className={styles.list}>
        {crew.map((c) => (
          <div className={styles.row} key={c.crew_id}>
            <span className={styles.id}>{c.crew_id}.</span>
            <span className={styles.name}>{c.first_name} {c.last_name}</span>
            {/* Kung may sales field sa backend, gamitin mo dito */}
            {/* <span className={styles.sales}>Sold {c.sales}</span> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrewList;

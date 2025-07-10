import React, { useEffect, useState } from 'react';
import styles from './StatsCards.module.css';
import client from '../../../api/feathers';

const StatsCards = ({ filter = 'today' }) => {
  const [stats, setStats] = useState({
    totalSales: 0,
    orderCount: 0,
    customerCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      client.service('orders').find(),
      client.service('crew').find()
    ]).then(([ordersRes, crewRes]) => {
      const orders = ordersRes.data;
      const crew = crewRes.data;

      // Date filtering logic
      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const monthStr = todayStr.slice(0, 7);

      function isInRange(dateStr) {
        if (filter === 'today') {
          return dateStr === todayStr;
        } else if (filter === 'week') {
          const d = new Date(dateStr);
          return d >= weekStart && d <= now;
        } else if (filter === 'month') {
          return dateStr.slice(0, 7) === monthStr;
        }
        return false;
      }

      const filteredOrders = orders.filter(order =>
        order.created_at && isInRange(order.created_at.slice(0, 10))
      );
      const totalSales = filteredOrders.reduce((sum, o) => sum + Number(o.total_price || 0), 0);
      setStats({
        totalSales: totalSales.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }),
        orderCount: filteredOrders.length,
        customerCount: crew.length,
      });
      setLoading(false);
    }).catch(err => {
      console.error('Error fetching stats:', err);
      setLoading(false);
    });
  }, [filter]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.statsCardsContainer}>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Total Sales</div>
        <div className={styles.cardValue}>{stats.totalSales}</div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Order Count</div>
        <div className={styles.cardValue}>{stats.orderCount}</div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Total Customer Count</div>
        <div className={styles.cardValue}>{stats.customerCount}</div>
      </div>
    </div>
  );
};

export default StatsCards;

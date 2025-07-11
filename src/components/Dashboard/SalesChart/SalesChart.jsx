import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './SalesChart.module.css';
import client from '../../../api/feathers';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HOURS = [
  '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'
];

const options = {
  responsive: true,
  maintainAspectRatio: true, // let chart fill container naturally
  plugins: {
    legend: {
      display: false, // Disable built-in legend
    },
    title: {
      display: false,
    },
    tooltip: {
      enabled: true,
      callbacks: {
        label: (context) => `₱${context.parsed.y.toLocaleString()}`,
      },
    },
  },
  layout: { padding: { top: 0, right: 8, bottom: 0, left: 8 } }, // minimal padding
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: '#232323',
        font: { size: 14, weight: 'bold', family: 'Inter, system-ui, sans-serif' },
        maxRotation: 0,
        minRotation: 0,
        padding: 10,
      },
      categoryPercentage: 0.75,
      barPercentage: 0.75,
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: '#232323',
        font: { size: 13, weight: 'bold', family: 'Inter, system-ui, sans-serif' },
        callback: (value) => `₱${value.toLocaleString()}`,
        stepSize: 500,
        padding: 18,
      },
      grid: { color: '#e0e0e0', borderDash: [2, 2] },
    },
  },
  elements: {
    bar: {
      borderRadius: 6,
    },
  },
};

const SalesChart = ({ filter = 'today' }) => {
  const [chartData, setChartData] = useState({ labels: HOURS, datasets: [] });
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState({ today: true, yesterday: true });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      client.service('orders').find(),
      client.service('order_items').find()
    ]).then(([ordersRes, orderItemsRes]) => {
      const orders = ordersRes.data;
      const orderItems = orderItemsRes.data;

      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      const todaySales = {};
      const yesterdaySales = {};
      HOURS.forEach(h => { todaySales[h] = 0; yesterdaySales[h] = 0; });

      orders.forEach(order => {
        if (!order.created_at) return;
        const dateStr = order.created_at.slice(0, 10);
        const date = new Date(order.created_at);
        let hour = date.getHours();
        if (hour < 10 || hour > 17) return;
        let label = hour === 12 ? '12PM' : hour > 12 ? `${hour - 12}PM` : `${hour}AM`;
        if (!HOURS.includes(label)) return;
        const total = orderItems
          .filter(item => item.order_id === order.order_id)
          .reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
        if (dateStr === todayStr) {
          todaySales[label] += total;
        } else if (dateStr === yesterdayStr) {
          yesterdaySales[label] += total;
        }
      });

      const datasets = [];
      if (visible.today) {
        datasets.push({
          label: 'Today',
          data: HOURS.map(label => todaySales[label] || 0),
          backgroundColor: '#bdbdbd',
          borderRadius: 6,
          barPercentage: 0.75,
          categoryPercentage: 0.75,
        });
      }
      if (visible.yesterday) {
        datasets.push({
          label: 'Yesterday',
          data: HOURS.map(label => yesterdaySales[label] || 0),
          backgroundColor: '#23232b',
          borderRadius: 6,
          barPercentage: 0.75,
          categoryPercentage: 0.75,
        });
      }

      setChartData({
        labels: HOURS,
        datasets,
      });
      setLoading(false);
    }).catch(err => {
      console.error('Error fetching sales data:', err);
      setLoading(false);
    });
  }, [filter, visible]);

  const handleLegendClick = (key) => {
    setVisible(v => ({ ...v, [key]: !v[key] }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartTitle} style={{ marginBottom: 6 }}>Order / Sales</div>
      <div className={styles.customLegendContainer}>
        <span
          className={styles.legendItem + ' ' + (!visible.today ? styles.legendInactive : '')}
          onClick={() => handleLegendClick('today')}
          style={{ cursor: 'pointer' }}
        >
          <span className={styles.legendBox} style={{ background: '#bdbdbd', opacity: visible.today ? 1 : 0.3 }}></span>
          Today
        </span>
        <span
          className={styles.legendItem + ' ' + (!visible.yesterday ? styles.legendInactive : '')}
          onClick={() => handleLegendClick('yesterday')}
          style={{ cursor: 'pointer' }}
        >
          <span className={styles.legendBox} style={{ background: '#23232b', opacity: visible.yesterday ? 1 : 0.3 }}></span>
          Yesterday
        </span>
      </div>
      <div className={styles.chartArea} style={{ marginTop: 0 }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SalesChart;

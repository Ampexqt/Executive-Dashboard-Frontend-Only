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

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      align: 'start',
      labels: {
        color: '#7d8592',
        font: { size: 13, weight: '400', family: 'Inter, system-ui, sans-serif' },
        boxWidth: 12,
        boxHeight: 12,
        padding: 8,
      },
    },
    title: {
      display: true,
      text: 'Order / Sales',
      align: 'start',
      color: '#232a36',
      font: { size: 15, weight: '400', family: 'Inter, system-ui, sans-serif' },
      padding: { bottom: 4 },
    },
    tooltip: {
      enabled: true,
      callbacks: {
        label: (context) => `₱${context.parsed.y.toLocaleString()}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: '#7d8592',
        font: { size: 12, weight: '400', family: 'Inter, system-ui, sans-serif' },
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: '#7d8592',
        font: { size: 12, weight: '400', family: 'Inter, system-ui, sans-serif' },
        callback: (value) => `₱${(value / 1000).toFixed(0)}K`,
        stepSize: 50000,
      },
      grid: { color: '#e0e0e0', borderDash: [2, 2] },
    },
  },
  layout: { padding: 0 },
};

function getHourLabel(dateStr) {
  const date = new Date(dateStr);
  let hour = date.getHours();
  let ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}${ampm}`;
}

function isInRange(dateStr, filter, today, weekStart, monthStr) {
  if (filter === 'today') {
    return dateStr === today;
  } else if (filter === 'week') {
    const d = new Date(dateStr);
    return d >= weekStart && d <= new Date(today);
  } else if (filter === 'month') {
    return dateStr.slice(0, 7) === monthStr;
  }
  return false;
}

const SalesChart = ({ filter = 'today' }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      client.service('orders').find(),
      client.service('order_items').find()
    ]).then(([ordersRes, orderItemsRes]) => {
      const orders = ordersRes.data;
      const orderItems = orderItemsRes.data;

      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const monthStr = todayStr.slice(0, 7);

      // Group sales per hour for selected filter
      const sales = {};

      orders.forEach(order => {
        if (!order.created_at) return;
        const dateStr = order.created_at.slice(0, 10);
        if (!isInRange(dateStr, filter, todayStr, weekStart, monthStr)) return;
        const hourLabel = getHourLabel(order.created_at);

        // Find all items for this order
        const items = orderItems.filter(item => item.order_id === order.order_id);
        const total = items.reduce((sum, item) =>
          sum + ((item.price || 0) * (item.quantity || 0)), 0);

        sales[hourLabel] = (sales[hourLabel] || 0) + total;
      });

      // Get all unique hour labels, sorted by hour
      const allHourLabels = Object.keys(sales).sort((a, b) => {
        // Sort by hour (12AM, 1AM, ..., 11PM)
        const parse = s => {
          let [h, ampm] = [parseInt(s), s.slice(-2)];
          if (ampm === 'PM' && h !== 12) h += 12;
          if (ampm === 'AM' && h === 12) h = 0;
          return h;
        };
        return parse(a) - parse(b);
      });

      setChartData({
        labels: allHourLabels,
        datasets: [
          {
            label: filter === 'today' ? 'Today' : filter === 'week' ? 'This Week' : 'This Month',
            data: allHourLabels.map(label => sales[label] || 0),
            backgroundColor: '#b0b0b0',
            borderRadius: 6,
            barPercentage: 0.6,
            categoryPercentage: 0.6,
          },
        ],
      });
      setLoading(false);
    }).catch(err => {
      console.error('Error fetching sales data:', err);
      setLoading(false);
    });
  }, [filter]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.card} style={{ height: 420, background: '#f7f8fa' }}>
      <Bar data={chartData} options={options} height={420} />
    </div>
  );
};

export default SalesChart;

import React, { useEffect, useState } from 'react';
import styles from './OrderList.module.css';
import client from '../../../api/feathers';

const ORDERS_PER_PAGE = 4;

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let isMounted = true;

    // Initial fetch
    Promise.all([
      client.service('orders').find(),
      client.service('order_items').find()
    ])
      .then(([ordersRes, orderItemsRes]) => {
        if (isMounted) {
          setOrders(ordersRes.data);
          setOrderItems(orderItemsRes.data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error('Error fetching orders or order_items:', err);
          setLoading(false);
        }
      });

    // Real-time listeners
    const updateData = () => {
      Promise.all([
        client.service('orders').find(),
        client.service('order_items').find()
      ]).then(([ordersRes, orderItemsRes]) => {
        if (isMounted) {
          setOrders(ordersRes.data);
          setOrderItems(orderItemsRes.data);
        }
      });
    };

    const orderService = client.service('orders');
    const orderItemsService = client.service('order_items');

    orderService.on('created', updateData);
    orderService.on('patched', updateData);
    orderService.on('removed', updateData);

    orderItemsService.on('created', updateData);
    orderItemsService.on('patched', updateData);
    orderItemsService.on('removed', updateData);

    return () => {
      isMounted = false;
      orderService.removeListener('created', updateData);
      orderService.removeListener('patched', updateData);
      orderService.removeListener('removed', updateData);
      orderItemsService.removeListener('created', updateData);
      orderItemsService.removeListener('patched', updateData);
      orderItemsService.removeListener('removed', updateData);
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  // Pagination logic
  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.card}>
      <div className={styles.title}>Live Order List</div>
      <div className={styles.list}>
        {paginatedOrders.map((order, idx) => {
          const items = orderItems.filter(
            item => String(item.order_id).trim() === String(order.order_id).trim()
          );
          const itemNames = items.length > 0
            ? items.map(item => item.item_name).join(', ')
            : <span style={{ color: 'gray', fontStyle: 'italic' }}>No items</span>;
          return (
            <div className={styles.row} key={order.order_id}>
              <span className={styles.id}>{String((currentPage - 1) * ORDERS_PER_PAGE + idx + 1).padStart(3, '0')}.</span>
              <span className={styles.name}>{itemNames}</span>
              <button className={styles.viewBtn}>View</button>
            </div>
          );
        })}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={styles.viewBtn}
              style={{
                margin: '0 0.25rem',
                backgroundColor: currentPage === i + 1 ? '#222' : '',
                color: currentPage === i + 1 ? '#fff' : '',
                border: currentPage === i + 1 ? '2px solid #222' : ''
              }}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;

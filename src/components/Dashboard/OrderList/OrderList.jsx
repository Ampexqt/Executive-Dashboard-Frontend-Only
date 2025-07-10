import React, { useEffect, useState } from 'react';
import styles from './OrderList.module.css';
import client from '../../../api/feathers';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className={styles.card}>
      <div className={styles.title}>Live Order List</div>
      <div className={styles.list}>
        {orders.map((order) => {
          const items = orderItems.filter(
            item => String(item.order_id) === String(order.order_id)
          );
          if (items.length === 0) {
            console.log('Order with no items:', order);
          }
          const itemNames = items.length > 0
            ? items.map(item => item.item_name).join(', ')
            : <span style={{ color: 'gray', fontStyle: 'italic' }}>No items</span>;
          return (
            <div className={styles.row} key={order.order_id}>
              <span className={styles.name}>
                <b>Order #{order.order_id}:</b> {itemNames}
              </span>
              <button className={styles.viewBtn}>View</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderList;

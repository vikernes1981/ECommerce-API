import express from 'express';
import { getOrders, createOrder, getOrderById, updateOrder, deleteOrder } from '../controllers/orders.js';

const router = express.Router();

router.get('/', getOrders);
router.post('/', createOrder);
router.get('/:id', getOrderById);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;

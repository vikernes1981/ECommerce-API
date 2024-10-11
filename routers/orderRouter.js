const express = require('express');
const { getOrders, createOrder, getOrderById, updateOrder, deleteOrder } = require('../controllers/orders');
const router = express.Router();

router.get('/', getOrders);
router.post('/', createOrder);
router.get('/:id', getOrderById);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

module.exports = router;

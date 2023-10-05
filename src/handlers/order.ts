import express, { Request, Response } from 'express';
import verifyToken from '../middleware/auth';
import {
  IOrder,
  IOrderDetail,
  IUpdateOrder,
  OrderStore,
} from '../models/order';
import { IUser } from '../models/user';
import AppRequest from '../types/app';

const store = new OrderStore();

const index = async (_req: Request, res: Response) => {
  const orders = await store.index();
  if (!orders) {
    res.status(400).json({ error: 'Orders not found' });
    return;
  }
  res.json(orders);
};

const show = async (req: Request, res: Response) => {
  const order = await store.show(req.params.id);
  if (!order) {
    res.status(400).json({ error: 'Order not found' });
    return;
  }
  res.json(order);
};

const create = async (req: AppRequest, res: Response) => {
  const user = req.user as { user?: IUser };
  const order = {
    status: req.body.status,
    user_id: user?.user?.id?.toString() || '',
  };
  const newOrder = await store.create(order as unknown as IOrder);
  if (!newOrder) {
    res.status(400).json({ error: 'Order not created' });
    return;
  }
  res.json(newOrder);
};

const destroy = async (req: Request, res: Response) => {
  const deleted = await store.delete(req.params.id);
  if (!deleted) {
    res.status(400).json({ error: 'Order not deleted' });
    return;
  }
  res.json(deleted);
};

const update = async (req: Request, res: Response) => {
  const id = req.params.id;
  const order = {
    ...req.body,
    id,
  };
  const updated = await store.update(order as unknown as IUpdateOrder);
  if (!updated) {
    res.status(400).json({ error: 'Order not updated' });
    return;
  }
  res.json(updated);
};

const addProduct = async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const productId = req.body.productId;
  const quantity = req.body.quantity;
  const addProductObject = {
    order_id: orderId,
    product_id: productId,
    quantity,
  };

  const added = await store.addProduct(
    addProductObject as unknown as IOrderDetail,
  );
  if (!added) {
    res.status(400).json({ error: 'Product not added to order' });
    return;
  }
  res.json(added);
};

const showProduct = async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const order = await store.showOrderDetail(orderId);
  if (!order) {
    res.status(400).json({ error: 'Order not found' });
    return;
  }
  res.json(order);
};

const deleteProduct = async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const deleted = await store.deleteOrderDetail(orderId);
  if (!deleted) {
    res.status(400).json({ error: 'Product not deleted from order' });
    return;
  }
  res.json(deleted);
};

const orderRoutes = (app: express.Application) => {
  /**
   * @swagger
   * /orders:
   *   get:
   *     summary: Retrieve a list of orders
   *     tags: [Orders]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of orders
   *       400:
   *         description: Orders not found
   */
  app.get('/orders', verifyToken, index);

  /**
   * @swagger
   * /orders/{id}:
   *   get:
   *     summary: Retrieve a specific order by ID
   *     tags: [Orders]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           example: 1
   *         required: true
   *         description: Order ID
   *     responses:
   *       200:
   *         description: Order details
   *       400:
   *         description: Order not found
   */
  app.get('/orders/:id', verifyToken, show);

  /**
   * @swagger
   * /orders:
   *   post:
   *     summary: Create a new order
   *     tags: [Orders]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *                 example: open
   *     responses:
   *       200:
   *         description: Returns the created order
   *       400:
   *         description: Order not created
   */
  app.post('/orders', verifyToken, create);

  /**
   * @swagger
   * /orders/{id}:
   *   delete:
   *     summary: Delete an order by ID
   *     tags: [Orders]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           example: 1
   *         required: true
   *         description: Order ID
   *     responses:
   *       200:
   *         description: Returns the deleted order
   *       400:
   *         description: Order not deleted
   */
  app.delete('/orders/:id', verifyToken, destroy);

  /**
   * @swagger
   * /orders/{id}:
   *   put:
   *     summary: Update an order by ID
   *     tags: [Orders]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           example: 1
   *         required: true
   *         description: Order ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *     responses:
   *       200:
   *         description: Returns the updated order
   *       400:
   *         description: Order not updated
   */
  app.put('/orders/:id', verifyToken, update);

  /**
   * @swagger
   * /orders/{id}/products:
   *   post:
   *     summary: Add a product to an order
   *     tags: [Orders]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           example: 1
   *         required: true
   *         description: Order ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               productId:
   *                 type: string
   *                 example: 1
   *               quantity:
   *                 type: number
   *                 example: 2
   *     responses:
   *       200:
   *         description: Returns the added product details
   *       400:
   *         description: Product not added to order
   */
  app.post('/orders/:id/products', verifyToken, addProduct);

  /**
   * @swagger
   * /orders/{id}/products:
   *   get:
   *     summary: Retrieve products for a specific order
   *     tags: [Orders]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           example: 1
   *         required: true
   *         description: Order ID
   *     responses:
   *       200:
   *         description: List of products for the order
   *       400:
   *         description: Order not found
   */
  app.get('/orders/:id/products', verifyToken, showProduct);

  /**
   * @swagger
   * /orders/{id}/products:
   *   delete:
   *     summary: Remove a product from an order
   *     tags: [Orders]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           example: 1
   *         required: true
   *         description: Order ID
   *     responses:
   *       200:
   *         description: Returns the deleted product details from the order
   *       400:
   *         description: Product not deleted from order
   */
  app.delete('/orders/:id/products', verifyToken, deleteProduct);
};

export default orderRoutes;

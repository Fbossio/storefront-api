import express, { Request, Response } from 'express';
import verifyToken from '../middleware/auth';
import { IOrder, IUpdateOrder, OrderStore } from '../models/order';
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

const orderRoutes = (app: express.Application) => {
  app.get('/orders', verifyToken, index);
  app.get('/orders/:id', verifyToken, show);
  app.post('/orders', verifyToken, create);
  app.delete('/orders/:id', verifyToken, destroy);
  app.put('/orders/:id', verifyToken, update);
};

export default orderRoutes;

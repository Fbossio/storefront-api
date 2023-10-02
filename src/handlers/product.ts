import express, { Request, Response } from 'express';
import { IProduct, IUpdateProduct, ProductStore } from '../models/product';

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
  const products = await store.index();
  if (!products) res.status(400).json({ error: 'Products not found' });
  res.json(products);
};

const show = async (req: Request, res: Response) => {
  const product = await store.show(req.params.id);
  if (!product) res.status(400).json({ error: 'Product not found' });
  res.json(product);
};

const create = async (req: Request, res: Response) => {
  const product = {
    name: req.body.name,
    price: parseInt(req.body.price),
    category: req.body.category,
  };
  const newProduct = await store.create(product as unknown as IProduct);
  if (!newProduct) res.status(400).json({ error: 'Product not created' });
  res.json(newProduct);
};

const destroy = async (req: Request, res: Response) => {
  const deleted = await store.delete(req.params.id);
  if (!deleted) res.status(400).json({ error: 'Product not found' });
  res.json(deleted);
};

const update = async (req: Request, res: Response) => {
  const product = {
    ...req.body,
  };
  const updated = await store.update(product as unknown as IUpdateProduct);
  if (!updated) res.status(400).json({ error: 'Product not updated' });
  res.json(updated);
};

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', create);
  app.delete('/products/:id', destroy);
  app.put('/products', update);
};

export default productRoutes;

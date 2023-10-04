import express, { Request, Response } from 'express';
import verifyToken from '../middleware/auth';
import { IProduct, IUpdateProduct, ProductStore } from '../models/product';

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
  const products = await store.index();
  if (!products) {
    res.status(400).json({ error: 'Products not found' });
    return;
  }
  res.json(products);
};

const show = async (req: Request, res: Response) => {
  const product = await store.show(req.params.id);
  if (!product) {
    res.status(400).json({ error: 'Product not found' });
    return;
  }
  res.json(product);
};

const create = async (req: Request, res: Response) => {
  const product = {
    name: req.body.name,
    price: parseInt(req.body.price),
    category: req.body.category,
  };
  const newProduct = await store.create(product as unknown as IProduct);
  if (!newProduct) {
    res.status(400).json({ error: 'Product not created' });
    return;
  }
  res.json(newProduct);
};

const destroy = async (req: Request, res: Response) => {
  const deleted = await store.delete(req.params.id);
  if (!deleted) {
    res.status(400).json({ error: 'Product not deleted' });
    return;
  }
  res.json(deleted);
};

const update = async (req: Request, res: Response) => {
  const id = req.params.id;
  const product = {
    ...req.body,
    id,
  };
  const updated = await store.update(product as unknown as IUpdateProduct);
  if (!updated) {
    res.status(400).json({ error: 'Product not updated' });
    return;
  }
  res.json(updated);
};

const topProducts = async (_req: Request, res: Response) => {
  const products = await store.topProducts();
  if (!products) {
    res.status(400).json({ error: 'Products not found' });
    return;
  }
  res.json(products);
};

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyToken, create);
  app.delete('/products/:id', verifyToken, destroy);
  app.put('/products/:id', verifyToken, update);
  app.get('/top_products', topProducts);
};

export default productRoutes;

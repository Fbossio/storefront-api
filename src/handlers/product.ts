import express, { Request, Response } from 'express';
import verifyToken from '../middleware/auth';
import { IProduct, IUpdateProduct, ProductStore } from '../models/product';

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index();
    if (!products) {
      res.status(400).json({ error: 'Products not found' });
      return;
    }
    res.json(products);
  } catch (error) {
    throw new Error(`Error fetching products: ${error}`);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const product = await store.show(req.params.id);
    if (!product) {
      res.status(400).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    throw new Error(`Error fetching product: ${error}`);
  }
};

const create = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    throw new Error(`Error creating product: ${error}`);
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const deleted = await store.delete(req.params.id);
    if (!deleted) {
      res.status(400).json({ error: 'Product not deleted' });
      return;
    }
    res.json(deleted);
  } catch (error) {
    throw new Error(`Error deleting product: ${error}`);
  }
};

const update = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    throw new Error(`Error updating product: ${error}`);
  }
};

const topProducts = async (_req: Request, res: Response) => {
  try {
    const products = await store.topProducts();
    if (!products) {
      res.status(400).json({ error: 'Products not found' });
      return;
    }
    res.json(products);
  } catch (error) {
    throw new Error(`Error fetching products: ${error}`);
  }
};

const productRoutes = (app: express.Application) => {
  /**
   * @swagger
   * /products:
   *   get:
   *     summary: Retrieve a list of products
   *     tags: [Products]
   *     security: []
   *     responses:
   *       200:
   *         description: List of products
   *       400:
   *         description: Products not found
   */
  app.get('/products', index);

  /**
   * @swagger
   * /products/{id}:
   *   get:
   *     summary: Retrieve a specific product by ID
   *     tags: [Products]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           example: 1
   *         required: true
   *         description: Product ID
   *     responses:
   *       200:
   *         description: Product details
   *       400:
   *         description: Product not found
   */
  app.get('/products/:id', show);

  /**
   * @swagger
   * /products:
   *   post:
   *     summary: Create a new product
   *     tags: [Products]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: product1
   *               price:
   *                 type: number
   *                 example: 100
   *               category:
   *                 type: string
   *                 example: category1
   *     responses:
   *       200:
   *         description: Returns the created product
   *       400:
   *         description: Product not created
   */
  app.post('/products', verifyToken, create);

  /**
   * @swagger
   * /products/{id}:
   *   delete:
   *     summary: Delete a product by ID
   *     tags: [Products]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           example: 1
   *         required: true
   *         description: Product ID
   *     responses:
   *       200:
   *         description: Returns the deleted product
   *       400:
   *         description: Product not deleted
   */
  app.delete('/products/:id', verifyToken, destroy);

  /**
   * @swagger
   * /products/{id}:
   *   put:
   *     summary: Update a product by ID
   *     tags: [Products]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Product ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: product2
   *               price:
   *                 type: number
   *                 example: 200
   *               category:
   *                 type: string
   *                 example: category2
   *     responses:
   *       200:
   *         description: Returns the updated product
   *       400:
   *         description: Product not updated
   */
  app.put('/products/:id', verifyToken, update);

  /**
   * @swagger
   * /top_products:
   *   get:
   *     summary: Retrieve a list of top 5 products
   *     tags: [Products]
   *     security: []
   *     responses:
   *       200:
   *         description: List of top products
   *       400:
   *         description: Products not found
   */
  app.get('/top_products', topProducts);
};

export default productRoutes;

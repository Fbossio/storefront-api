import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import verifyToken from '../middleware/auth';
import { UserStore } from '../models/user';

const store = new UserStore();

const signUp = async (req: Request, res: Response) => {
  const user = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
  };
  const newUser = await store.create(user);
  if (!newUser) {
    res.status(400).json({ error: 'User not created' });
    return;
  }
  const token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET as string);
  res.json(token);
};

const signIn = async (req: Request, res: Response) => {
  const user = await store.authenticate(req.body.email, req.body.password);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const token = jwt.sign({ user }, process.env.TOKEN_SECRET as string);
  res.json(token);
};

const create = async (req: Request, res: Response) => {
  const user = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
  };
  const newUser = await store.create(user);
  res.json(newUser);
};

const show = async (req: Request, res: Response) => {
  const user = await store.show(req.params.id);
  if (!user) {
    res.status(400).json({ error: 'User not found' });
    return;
  }
  res.json(user);
};

const userRoutes = (app: express.Application) => {
  /**
   * @swagger
   * /signup:
   *   post:
   *     summary: Sign up a new user
   *     tags: [Users]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               firstname:
   *                 type: string
   *                 example: test
   *               lastname:
   *                 type: string
   *                 example: user
   *               email:
   *                 type: string
   *                 example: test@user.com
   *               password:
   *                 type: string
   *                 example: password
   *     responses:
   *       200:
   *         description: Returns a JWT token
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *       400:
   *         description: User not created
   */
  app.post('/signup', signUp);

  /**
   * @swagger
   * /signin:
   *   post:
   *     summary: Sign in a user
   *     tags: [Users]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: test@user.com
   *               password:
   *                 type: string
   *                 example: password
   *     responses:
   *       200:
   *         description: Returns a JWT token
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *       401:
   *         description: Unauthorized
   */
  app.post('/signin', signIn);

  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Create a new user
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               firstname:
   *                 type: string
   *                 example: test2
   *               lastname:
   *                 type: string
   *                 example: user2
   *               email:
   *                 type: string
   *                 example: test2@user.com
   *               password:
   *                 type: string
   *                 example: password
   *     responses:
   *       200:
   *         description: Returns the created user
   */
  app.post('/users', verifyToken, create);

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     summary: Retrieve a user by ID
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           example: 1
   *         required: true
   *         description: User ID
   *     responses:
   *       200:
   *         description: Returns the user details
   *       400:
   *         description: User not found
   */
  app.get('/users/:id', verifyToken, show);
};

export default userRoutes;

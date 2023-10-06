import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import verifyToken from '../middleware/auth';
import { UserStore } from '../models/user';

const store = new UserStore();

const signUp = async (req: Request, res: Response) => {
  try {
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
    const token = jwt.sign(
      { user: newUser },
      process.env.TOKEN_SECRET as string,
    );
    res.json(token);
  } catch (error) {
    throw new Error(`Error signing up user: ${error}`);
  }
};

const signIn = async (req: Request, res: Response) => {
  try {
    const user = await store.authenticate(req.body.email, req.body.password);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const token = jwt.sign({ user }, process.env.TOKEN_SECRET as string);
    res.json(token);
  } catch (error) {
    throw new Error(`Error signing in user: ${error}`);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const user = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
    };
    const newUser = await store.create(user);
    res.json(newUser);
  } catch (error) {
    throw new Error(`Error creating user: ${error}`);
  }
};

const index = async (_req: Request, res: Response) => {
  try {
    const users = await store.index();
    if (!users) {
      res.status(400).json({ error: 'Users not found' });
      return;
    }
    res.json(users);
  } catch (error) {
    throw new Error(`Error fetching users: ${error}`);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const user = await store.show(req.params.id);
    if (!user) {
      res.status(400).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    throw new Error(`Error fetching user: ${error}`);
  }
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
   * /users:
   *   get:
   *     summary: Retrieve a list of users
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: Returns a list of users
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                   firstname:
   *                     type: string
   *                   lastname:
   *                     type: string
   *                   email:
   *                     type: string
   *                   password:
   *                     type: string
   *       400:
   *         description: Users not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
  app.get('/users', verifyToken, index);

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

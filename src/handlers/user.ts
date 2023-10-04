import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
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

const show = async (req: Request, res: Response) => {
  const user = await store.show(req.params.id);
  if (!user) {
    res.status(400).json({ error: 'User not found' });
    return;
  }
  res.json(user);
};

const userRoutes = (app: express.Application) => {
  app.post('/signup', signUp);
  app.post('/signin', signIn);
  app.get('/users/:id', show);
};

export default userRoutes;

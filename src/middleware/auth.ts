import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import AppRequest from '../types/app';

const verifyToken = (req: AppRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ error: 'No token provided.' });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  jwt.verify(token, process.env.TOKEN_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token.' });
    }
    // If token is verified successfully, user data can be accessed using req.user
    req.user = decoded;
    next();
  });
};

export default verifyToken;

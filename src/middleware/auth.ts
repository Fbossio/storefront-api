import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
interface AuthRequest extends Request {
  user?: unknown;
}

const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ error: 'No token provided.' });
  }

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

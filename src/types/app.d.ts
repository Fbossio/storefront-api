import { Request } from 'express';

interface AppRequest extends Request {
  user?: unknown;
}
export default AppRequest;

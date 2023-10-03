import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import productRoutes from './handlers/product';
import userRoutes from './handlers/user';
const app: express.Application = express();
const address: string = '0.0.0.0:3000';

app.use(bodyParser.json());
app.use(cors());

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!');
});

productRoutes(app);
userRoutes(app);

const server = app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});

export default server;

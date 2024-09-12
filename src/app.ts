import  path from 'path';
// Import the 'express' module
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import router from './config/routes';
import globalErrorHandler from './middlewares/globalErrorHandler';
// import notFound from './middlewares/notFound';
import logger from './logger/looger';
import { PrismaClient ,Prisma} from '@prisma/client';
import config from './config';
// import config from './config/index';


// Create an Express application
const app: Application = express();

const prisma = new PrismaClient()
//parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.static("public"));
// app.use("/public", express.static(__dirname + "/public"));

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

//application router
app.use('/api/v1',router)


// Set the port number for the server

// Define a route for the root path ('/')
app.get('/', (req: Request, res: Response) => {
    logger.info('Root endpoint hit');
    let template=`<h1 style="text-align:center">Hello</h1>
    <h2 style="text-align:center">This Backend is created by Iftekhar Salmin Rashid</h2>
    <h2 style="text-align:center"> Backend Developer</h2>
    `
    res.send(template);
  });

// app.all('*',notFound)
app.use(globalErrorHandler)


// Log errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error occurred: ${err.message}`, { stack: err.stack });
  next(err);
});

app.get('/check-db', async (req, res) => {
    try {
      await prisma.$connect(); // Explicitly attempt to connect to the DB
      res.status(200).send('Database connection is successful.');
    } catch (error) {
      console.error('Database connection error:', error);
      res.status(500).send({ message: 'Failed to connect to the database.', error });
    } finally {
      await prisma.$disconnect(); // Clean up connection
    }
  });

export default app
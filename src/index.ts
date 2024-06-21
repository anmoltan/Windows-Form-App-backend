import express, { Request, Response } from 'express';
import routes from './routes'; // Adjust the path according to your project structure

const app = express();
const port = 3000;

app.use(express.json());
app.use('/', routes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


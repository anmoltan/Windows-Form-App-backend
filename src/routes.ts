import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
const dbPath = path.join(__dirname, 'db.json');

// Middleware to ensure db.json exists
function ensureDatabaseExists(req: Request, res: Response, next: Function) {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify([]));
    }
    next();
}

// Ping endpoint
router.get('/ping', (req: Request, res: Response) => {
    res.json(true);
});

// Submit endpoint
router.post('/submit', ensureDatabaseExists, (req: Request, res: Response) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    const data = { name, email, phone, github_link, stopwatch_time };

    try {
        const db: any[] = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        db.push(data);
        fs.writeFileSync(dbPath, JSON.stringify(db));
        res.json({ message: 'Submission saved successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to save submission', error: error.message });
    }
});

// Read endpoint
router.get('/read', ensureDatabaseExists, (req: Request, res: Response) => {
    const index = parseInt(req.query.index as string, 10);

    try {
        const db: any[] = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        if (isNaN(index) || index < 0 || index >= db.length) {
            res.status(404).json({ message: 'Submission not found' });
        } else {
            res.json(db[index]);
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to fetch submission', error: error.message });
    }
});

export default router;

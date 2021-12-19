import express from 'express';
import addNewsletter from '../services/newsletter/Add';
let router = express.Router();

router.post('/', addNewsletter);
export default router;
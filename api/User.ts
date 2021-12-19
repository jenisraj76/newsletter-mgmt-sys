import express from 'express';
import addUser from '../services/User/Add';
let router = express.Router();

router.post('/', addUser);
export default router;
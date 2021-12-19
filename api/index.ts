import express from 'express';
import newsletter from './Newsletter';
import user from './User';
let router = express.Router();

router.get('/api', [(req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(200).send('Api in On');
}]);
router.use('/newsletter', newsletter);
router.use('/user', user);
export default router;
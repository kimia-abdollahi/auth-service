import { Router } from 'express';
const { getClientToken, getUserToken, registerUser } = require('../controllers/auth.controller');

const router = Router();

router.post('/client-token', getClientToken);
router.post('/user-token', getUserToken);
router.post('/register', registerUser);

module.exports = router;

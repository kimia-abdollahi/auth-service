import { Router, Request, Response } from 'express';
const {
  getClientToken,
  getUserToken,
  registerUser,
} = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = Router();

router.post('/client-token', getClientToken);
router.post('/user-token', getUserToken);
router.post('/register', registerUser);

// Protected route - needs valid token
router.get('/profile', verifyToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({
    message: 'Protected profile route',
    user,
  });
});

module.exports = router;

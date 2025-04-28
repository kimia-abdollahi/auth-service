import { Router, Request, Response } from 'express';
const {
  getClientToken,
  getUserToken,
  registerUser,
  refreshAccessToken,
  logoutUser,
  updateProfile,
} = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = Router();

// Public routes
router.post('/client-token', getClientToken);
router.post('/user-token', getUserToken);
router.post('/register', registerUser);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', logoutUser);

// Protected routes
router.get('/profile', verifyToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({
    message: 'Protected profile route',
    user,
  });
});

router.put('/profile/update', verifyToken, updateProfile);

module.exports = router;

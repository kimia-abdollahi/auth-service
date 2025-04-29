import { Router, Request, Response } from 'express';
const {
  getClientToken,
  getUserToken,
  registerUser,
  refreshAccessToken,
  logoutUser,
  updateProfile,
  setUserRole,
} = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { verifyAdmin } = require('../middlewares/role.middleware');

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

// Admin-only routes
router.get('/admin-only', verifyToken, verifyAdmin, (req: Request, res: Response) => {
  res.json({ message: 'Welcome Admin! You have access.' });
});

router.put('/set-role', verifyToken, verifyAdmin, setUserRole);

module.exports = router;

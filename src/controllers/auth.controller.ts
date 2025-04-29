import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../models/user.model';
import { RefreshToken } from '../models/refreshToken.model';
import { publishToQueue } from '../utils/rabbit';

// Get Client Token
export function getClientToken(req: Request, res: Response) {
  const { client_id, client_secret } = req.body;

  if (
    client_id !== process.env.CLIENT_ID ||
    client_secret !== process.env.CLIENT_SECRET
  ) {
    return res.status(401).json({ message: 'Invalid client credentials' });
  }

  const token = jwt.sign({ type: 'client' }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });

  return res.json({ token });
}

// User Register
export async function registerUser(req: Request, res: Response) {
  const { username, password, role } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ 
    username, 
    password: hashedPassword,
    role: role || 'user',
  });

  await newUser.save();

  return res.status(201).json({ message: 'User registered successfully' });
}

// Get User Token (Login)
export async function getUserToken(req: Request, res: Response) {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = jwt.sign(
    { type: 'user', userId: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  const refreshToken = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt,
  });

  await publishToQueue('user.login', {
    userId: user._id,
    username: user.username,
    time: new Date().toISOString(),
  });

  return res.json({
    accessToken,
    refreshToken,
  });
}

// Refresh Access Token
export async function refreshAccessToken(req: Request, res: Response) {
  const { refreshToken } = req.body;

  const storedToken = await RefreshToken.findOne({ token: refreshToken });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }

  const user = await User.findById(storedToken.userId);
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  const newAccessToken = jwt.sign(
    { type: 'user', userId: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  return res.json({ accessToken: newAccessToken });
}

// Logout User
export async function logoutUser(req: Request, res: Response) {
  const { refreshToken } = req.body;

  const deletedToken = await RefreshToken.findOneAndDelete({ token: refreshToken });

  if (!deletedToken) {
    return res.status(400).json({ message: 'Refresh token not found or already deleted' });
  }

  return res.json({ message: 'Logged out successfully' });
}

// Update User Profile
export async function updateProfile(req: Request, res: Response) {
  const user = (req as any).user;
  const { username, password } = req.body;

  const foundUser = await User.findById(user.userId);
  if (!foundUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (username) {
    foundUser.username = username;
  }

  if (password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    foundUser.password = hashedPassword;
  }

  await foundUser.save();

  return res.json({ message: 'Profile updated successfully' });
}

// Set User Role (Admin only)
export async function setUserRole(req: Request, res: Response) {
  const { userId, role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.role = role;
  await user.save();

  return res.json({ message: `User role updated to ${role}` });
}

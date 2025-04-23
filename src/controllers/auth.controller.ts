import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';

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

// user register
export async function registerUser(req: Request, res: Response) {
  const { username, password } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, password: hashedPassword });

  await newUser.save();

  return res.status(201).json({ message: 'User registered successfully' });
}

// Get User Token
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

  const token = jwt.sign(
    { type: 'user', userId: user._id, username: user.username },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  return res.json({ token });
}

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.model.js'

// GET /auth
export const findAllUsers = async (req, res) => {
  try {
    const users = await User.findAll()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /auth/:id
export const findUserById = async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findById(id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /auth/register
export const register = async (req, res) => {
  const { email, password, firstname, lastname } = req.body
  try {
    const existingUser = await User.findByEmail(email)
    if (existingUser) return res.status(400).json({ message: 'Email already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({ email, password: hashedPassword, firstname, lastname })

    res.status(201).json({ message: 'User registered', id: newUser.insertId })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /auth/login
export const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findByEmail(email)
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.json({ token })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
///////////////////////////////////////////////////////////////////////////////
// PUT /auth/:id
export const updateUser = async (req, res) => {
  const { id } = req.params
  const { email, password, firstname, lastname, role } = req.body
  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined
    const user = await User.findById(id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    // On peut créer une méthode update dans le modèle
    await db.query(
      'UPDATE users SET email = ?, password = COALESCE(?, password), firstname = ?, lastname = ?, role = ? WHERE id = ?',
      [email || user.email, hashedPassword, firstname || user.firstname, lastname || user.lastname, role || user.role, id]
    )

    res.json({ message: 'User updated' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /auth/:id
export const deleteUser = async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findById(id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    await User.delete(id)
    res.json({ message: 'User deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

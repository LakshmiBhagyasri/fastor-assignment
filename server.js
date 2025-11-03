const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()
const { Employee, Enquiry, sequelize } = require('./models')

const app = express()
app.use(express.json())

// Register
app.post('/api/employees/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const employee = await Employee.create({ name, email, password })
    res.status(201).json({ message: 'Registered successfully', employee })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Login
app.post('/api/employees/login', async (req, res) => {
  const { email, password } = req.body
  const employee = await Employee.findOne({ where: { email } })
  if (!employee) return res.status(404).json({ message: 'User not found' })

  const valid = await bcrypt.compare(password, employee.password)
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

  const token = jwt.sign({ id: employee.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
  res.json({ message: 'Login successful', token })
})

// Auth middleware
const protect = (req, res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' })
  try {
    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded.id
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}

// Public enquiry (no auth)
app.post('/api/enquiries/public', async (req, res) => {
  const { name, email, courseInterest } = req.body
  const enquiry = await Enquiry.create({ name, email, courseInterest })
  res.status(201).json({ message: 'Enquiry submitted', enquiry })
})

// Unclaimed leads
app.get('/api/enquiries/public', protect, async (req, res) => {
  const enquiries = await Enquiry.findAll({ where: { claimed: false } })
  res.json(enquiries)
})

// Claimed leads
app.get('/api/enquiries/private', protect, async (req, res) => {
  const enquiries = await Enquiry.findAll({ where: { counselorId: req.user } })
  res.json(enquiries)
})

// Claim a lead
app.patch('/api/enquiries/:id/claim', protect, async (req, res) => {
  const enquiry = await Enquiry.findByPk(req.params.id)
  if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' })
  if (enquiry.claimed) return res.status(409).json({ message: 'Already claimed' })

  enquiry.claimed = true
  enquiry.counselorId = req.user
  await enquiry.save()
  res.json({ message: 'Lead claimed successfully', enquiry })
})

sequelize.sync().then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`🚀 Server running on port ${process.env.PORT}`)
  )
})

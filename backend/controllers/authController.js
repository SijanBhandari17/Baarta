const generateToken = require('../utils/generateToken');

exports.register = (req, res) => {
  const { username, email, password } = req.body;

  // You could hash the password here in the future
  const token = generateToken({ username, email });

  res.status(201).json({
    message: 'User registered successfully (simulated)',
    token,
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  // Simulated user check
  if (username === 'testuser' && password === 'password123') {
    const token = generateToken({ username });
    res.json({ message: 'Login successful', token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

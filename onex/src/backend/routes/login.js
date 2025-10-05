const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
res.cookie('token', token, { httpOnly: true });
res.json({ message: 'Login successful', token });

import jwt from 'jsonwebtoken';

export const login = (user, token) => {
  const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return {
    cookie: (name, value) => ({ name, value, httpOnly: true }),
    json: (json) => json
  };
};

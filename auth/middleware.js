const authenticationMiddleware = () => (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/api/v1/users/login');
};

module.exports = authenticationMiddleware;

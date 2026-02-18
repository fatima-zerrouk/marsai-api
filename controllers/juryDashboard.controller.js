export const juryDashboard = (req, res) => {
  console.log('req.user:', req.user);

  res.json({
    message: 'test dashboard jury',
    user: req.user,
  });
};

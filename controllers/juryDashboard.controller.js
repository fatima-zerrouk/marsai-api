export const juryDashboard = (req, res) => {

  res.json({
    message: 'test autorisation dashboard jury',
    user: req.user,
  });
};

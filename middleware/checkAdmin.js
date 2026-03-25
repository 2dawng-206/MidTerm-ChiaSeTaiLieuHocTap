module.exports = (req, res, next) => {
  const role = req.headers.role;  //  lấy từ header

  if (role !== 'admin'){
    return res.status(403).json({ message: 'Không có quyền admin' });
  }

  next();
};
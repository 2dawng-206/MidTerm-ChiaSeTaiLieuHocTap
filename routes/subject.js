const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const checkAdmin = require('../middleware/checkAdmin');

/* GET: lấy danh sách môn học */
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ code: 1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

/* POST: thêm môn học (admin) */
router.post('/', checkAdmin, async (req, res) => {
  try {
    const { code, name } = req.body;

    if (!code || !name) {
      return res.status(400).json({ message: 'Thiếu mã môn hoặc tên môn' });
    }

    const exists = await Subject.findOne({ code });
    if (exists) {
      return res.status(409).json({ message: 'Môn học đã tồn tại' });
    }

    const subject = new Subject({ code, name });
    await subject.save();

    res.status(201).json({
      message: 'Thêm môn học thành công',
      subject
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

/* DELETE: xóa môn học(admin) */
router.delete('/:id', checkAdmin, async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: 'Không tìm thấy môn học' });
    }

    res.json({ message: 'Xóa môn học thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
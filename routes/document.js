const checkAdmin = require('../middleware/checkAdmin');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Document = require('../models/Document');

// cấu hình nơi lưu file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// giới hạn loại file
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.ppt', '.pptx'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ cho phép PDF, DOC, PPT'));
    }
  }
});

/* Upload tài liệu */
router.post('/upload', checkAdmin, upload.single('file'), async (req, res) => {
  try {
    const { title, subject, userId } = req.body;

    if (!title || !subject || !userId) {
      return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Chưa chọn file" });
    }

    const doc = new Document({
      title,
      subject,
      filename: req.file.filename,
      uploader: userId
    });

    await doc.save();

    res.status(201).json({
      message: "Upload thành công",
      document: doc
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});
/* GET: danh sách tài liệu theo môn */
router.get('/', async (req, res) => {
  try {
    const { subject } = req.query;

    let filter = {};
    if (subject) {
      filter.subject = new RegExp(`^${subject}$`, 'i');;
    }

    const documents = await Document.find(filter)
      .populate('uploader', 'username')
      .sort({ uploadedAt: -1 });

    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

/* DELETE: xóa tài liệu */
router.delete('/:id', checkAdmin, async (req, res) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
    }

    res.json({ message: 'Xóa tài liệu thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

/* Register */
router.post('/register', async (req, res) =>{
	try {
		const { username, password } = req.body;
		
		if(!username || !password) {
			return res.status(400).json({ message: 'Thiếu username hoặc password' });
		}
		
		const existingUser = await User.findOne({ username});
		if (existingUser) {
			return res.status(409).json({ message: 'Username đã tồn tại' });
		}
		
		const hashedPassword = await bcrypt.hash(password, 10);
		
		const user = new User ({
			username,
			password: hashedPassword
		});
		
		await user.save();
		
		res.status(201).json({
			message: 'Đăng ký thành công',
			user: {
				id:user._id,
				username: user.username,
				role: user.role
			}
		});
	} catch (err){
		res.status(500).json({ message: 'Lỗi server' });
	}
});

/* Login */
router.post('/login', async (req, res) => {
	try{
		const {username, password} = req.body;
		
		if (!username || !password) {
			return res.status(400).json({ message: 'Thiếu username hoặc password' });
		}
		
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
		}
		
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
		}
		
		res.json({
			message: 'Đăng nhập thành công',
			user: {
				id: user._id,
				username: user.username,
				role: user.role
			}
		});
	}catch (err) {
		res.status(500).json({ message: 'Lỗi server' });
	}
});

/* test route */
router.get('/', (req, res) => {
	res.send('User route is working');
});

module.exports = router;
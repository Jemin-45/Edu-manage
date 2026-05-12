const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { authenticate, authorizeRole } = require('../middleware/auth');

router.get('/', authenticate, authorizeRole('admin', 'teacher'), getAllUsers);
router.post('/', authenticate, authorizeRole('admin'), createUser);
router.put('/:id', authenticate, authorizeRole('admin'), updateUser);
router.delete('/:id', authenticate, authorizeRole('admin'), deleteUser);

module.exports = router;

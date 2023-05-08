const {createUser, getAllUsers, getSingleUser, updateUser, deleteUser, login} = require('./user.controller');
const router = require('express').Router();
const {checkToken} = require('../../auth/token_validation');

router.post('/', checkToken, createUser);
router.get('/', checkToken, getAllUsers);
router.get('/:id', checkToken, getSingleUser);
router.patch('/:id',checkToken, updateUser);
router.delete('/:id', checkToken, deleteUser);
router.post('/login', login);

module.exports = router;
import express from 'express';
import{
    getUser,
    getUeserFriends,addRemoveFriend,
} from "../controllers/user.js";
import {verifyToken} from '../middleware/auth.js';
const router=express.Router();

//read
router.get('/:id',verifyToken,getUser);
router.get("/.id/friends",verifyToken,getUeserFriends);

router.patch('/:id/:friendId',verifyToken,addRemoveFriend);
export default router;
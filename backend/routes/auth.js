import express, { Router } from "express";
import{login} from "../controllers/auth.js";
const router=express.Router();
router.post("/login",login);
export default Router;
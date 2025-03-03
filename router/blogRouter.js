import express from 'express';
import { blogController,detailedBlogController } from '../controller/blogController.js';
import {fileURLToPath} from 'url';
import path from 'path';
import { status,message } from '../utils/statusMessage.js';

var blogRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
blogRouter.use(express.static(__dirname.replace('\\router','')+'/public'));
/*
if we comment this line blogRouter.use(express.static(__dirname.replace('\\router','')+'/public'));
then also front end properly works as we put <base href='/'> on every page <head> tag
*/
blogRouter.get('/',blogController);
blogRouter.get('/detailedBlog',detailedBlogController);

export default blogRouter;


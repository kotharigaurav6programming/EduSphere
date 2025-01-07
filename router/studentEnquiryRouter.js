import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { studentEnquiry } from '../controller/studentEnquiryController.js';
var studentEnquiryRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
studentEnquiryRouter.use(express.static(__dirname.replace('\\router','')+'/public'));

studentEnquiryRouter.post('/enquiry',studentEnquiry);

export default studentEnquiryRouter;
import express from 'express';
import { interviewSubjectController,interviewQuestionsController } from '../controller/interviewQuestionsController.js';
import {fileURLToPath} from 'url';
import path from 'path';
import { status,message } from '../utils/statusMessage.js';

var interviewQuestionsRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
interviewQuestionsRouter.use(express.static(__dirname.replace('\\router','')+'/public'));
/*
if we comment this line interviewQuestionsRouter.use(express.static(__dirname.replace('\\router','')+'/public'));
then also front end properly works as we put <base href='/'> on every page <head> tag
*/
interviewQuestionsRouter.get("/interviewSubject",interviewSubjectController);
interviewQuestionsRouter.get("/interviewQuestions",interviewQuestionsController);

export default interviewQuestionsRouter;


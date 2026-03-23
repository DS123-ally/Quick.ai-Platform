import express from 'express'
import {
  deleteCreation,
  generateArticle,
  generateBlogTitle,
  generateImage,
  getUserCreations,
  removeImageBackground,
  removeObjectFromImage,
  reviewResume,
} from '../controllers/aiController.js';
import { auth } from '../middlewares/auth.js';
import { upload } from '../configs/multer.js';

const aiRouter = express.Router();
aiRouter.post('/generate-article',auth,generateArticle)
aiRouter.post('/generate-blog-title',auth,generateBlogTitle)
aiRouter.post('/generate-image',auth,generateImage)
aiRouter.post('/remove-background',auth,upload.single('image'),removeImageBackground)
aiRouter.post('/remove-object',auth,upload.single('image'),removeObjectFromImage)
aiRouter.post('/review-resume',auth,upload.single('resume'),reviewResume)
aiRouter.get('/creations',auth,getUserCreations)
aiRouter.delete('/creations/:id',auth,deleteCreation)

export default aiRouter
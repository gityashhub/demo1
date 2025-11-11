import express from 'express';
import { createProjectShowcase, getProjectShowcases, updateProjectShowcase, deleteProjectShowcase} from '../controllers/projectshowController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/project-showcase/create', authMiddleware, createProjectShowcase);
router.get('/project-showcase/freelancer/:freelancerId', getProjectShowcases);
router.put('/project-showcase/update/:id', authMiddleware, updateProjectShowcase);
router.delete('/project-showcase/delete/:id', authMiddleware, deleteProjectShowcase);


export default router;

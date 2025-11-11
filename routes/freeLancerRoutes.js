import expess from 'express';
import { createFreelancerProfile, updateFreelancerProfile, getFreelancerProfile, deleteFreelancerProfile } from '../controllers/freeLancerProfiler.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = expess.Router();

router.post('/freelancer/create-profile', authMiddleware, createFreelancerProfile);
router.put('/freelancer/update-profile', authMiddleware, updateFreelancerProfile);
router.get('/freelancer/profile/:userId', getFreelancerProfile);
router.delete('/freelancer/delete-profile', authMiddleware, deleteFreelancerProfile);

export default router;
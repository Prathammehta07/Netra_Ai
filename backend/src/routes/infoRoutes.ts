import { Router } from 'express';
import { getGovernmentSchemes, getEmergencyNumbers } from '../controllers/infoController';

const router = Router();

router.get('/government-schemes', getGovernmentSchemes);
router.get('/emergency-numbers', getEmergencyNumbers);

export default router;

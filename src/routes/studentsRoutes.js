import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  createStudentSchema,
  studentIdParamSchema,
  updateStudentSchema,
} from '../validations/studentsValidation.js';
import {
  getStudents,
  getStudentById,
  createStudent,
  deleteStudent,
  updateStudent,
} from '../controllers/studentsControllers.js';

const router = Router();

router.get('/students', getStudents);
router.get(
  '/students/:studentId',
  celebrate(studentIdParamSchema),
  getStudentById,
);
router.post('/students', celebrate(createStudentSchema), createStudent);
router.delete(
  '/students/:studentId',
  celebrate(studentIdParamSchema),
  deleteStudent,
);
router.patch(
  '/students/:studentId',
  celebrate(updateStudentSchema),
  updateStudent,
);

export default router;

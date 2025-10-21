import { Student } from '../models/student.js';
import createHttpError from 'http-errors';

//* Get the list of all students
export const getStudents = async (req, res) => {
  // Get the pagination params
  const { page = 1, perPage = 10 } = req.query;
  const skip = (page - 1) * perPage;

  // Base query to collection
  const studentsQuery = Student.find();

  // Perform two queries in parallel
  const [totalItems, students] = await Promise.all([
    studentsQuery.clone().countDocuments(), // this will be totalItems
    studentsQuery.skip(skip).limit(perPage), // this one will be students
  ]);

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    page,
    perPage,
    totalItems,
    totalPages,
    students,
  });
};

//* Get a student by ID
export const getStudentById = async (req, res, next) => {
  const { studentId } = req.params;
  const student = await Student.findById(studentId);

  if (!student) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  res.status(200).json(student);
};

//* Create a student
export const createStudent = async (req, res) => {
  const student = await Student.create(req.body);
  res.status(201).json(student);
};

//* Delete a student
export const deleteStudent = async (req, res, next) => {
  const { studentId } = req.params;
  const student = await Student.findOneAndDelete({
    _id: studentId,
  });

  if (!student) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  res.status(200).json(student);
};

//* Update a student
export const updateStudent = async (req, res, next) => {
  const { studentId } = req.params;

  const student = await Student.findOneAndUpdate(
    { _id: studentId }, // Шукаємо по id
    req.body,
    { new: true }, // повертаємо оновлений документ
  );

  if (!student) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  res.status(200).json(student);
};

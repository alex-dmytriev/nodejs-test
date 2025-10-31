import { Student } from '../models/student.js';
import createHttpError from 'http-errors';

//* Get the list of all students
export const getStudents = async (req, res) => {
  // Get the pagination params
  const {
    page = 1,
    perPage = 10,
    gender,
    minAvgMark,
    search,
    sortBy = '_id',
    sortOrder = 'asc',
  } = req.query;

  const skip = (page - 1) * perPage;

  // Base query to search for students related to the user
  const studentsQuery = Student.find({ userId: req.user._id });

  // Text search by name
  if (search) {
    studentsQuery.where({
      $text: { $search: search },
    });
  }

  // Filters
  if (gender) {
    studentsQuery.where('gender').equals(gender);
  }
  if (minAvgMark) {
    studentsQuery.where('avgMark').gte(minAvgMark);
  }

  // Perform two queries in parallel
  const [totalItems, students] = await Promise.all([
    studentsQuery.clone().countDocuments(),
    studentsQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder }),
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

  // Search student related to the user by ID
  const student = await Student.findOne({
    _id: studentId,
    userId: req.user._id, // userId search
  });

  if (!student) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  res.status(200).json(student);
};

//* Create a student
export const createStudent = async (req, res) => {
  const student = await Student.create({ ...req.body, userId: req.user._id }); // add user id
  res.status(201).json(student);
};

//* Delete a student
export const deleteStudent = async (req, res, next) => {
  const { studentId } = req.params;
  const student = await Student.findOneAndDelete({
    _id: studentId,
    userId: req.user._id, // Search criteria by userId
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
    { _id: studentId, userId: req.user._id }, // Search by id + userId
    req.body,
    { new: true }, // return updated document
  );

  if (!student) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  res.status(200).json(student);
};

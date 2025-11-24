const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');

// ---------- Multer setup for photo upload ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // uploads folder is in backend root: backend/uploads
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // e.g. 17323423423.jpg
  },
});

const upload = multer({ storage });

// ---------- ROUTES ----------

// GET /api/employees?search=
router.get('/', async (req, res) => {
  const { search } = req.query;
  try {
    let sql = 'SELECT * FROM employees';
    const params = [];

    if (search) {
      const like = `%${search}%`;
      sql += `
        WHERE employee_name LIKE ?
           OR employee_code LIKE ?
           OR department LIKE ?
           OR designation LIKE ?
           OR project LIKE ?
      `;
      params.push(like, like, like, like, like);
    }

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/employees/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [
      req.params.id,
    ]);
    if (!rows.length) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/employees  
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const {
      employee_name,
      employee_code,
      department,
      designation,
      project,
      type,
      status,
    } = req.body;

    const photoPath = req.file ? `uploads/${req.file.filename}` : null;

    const [result] = await pool.query(
      `INSERT INTO employees
       (employee_name, employee_code, department, designation, project, type, status, photo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employee_name,
        employee_code,
        department || null,
        designation || null,
        project || null,
        type || 'Full-time',
        status || 'Active',
        photoPath,
      ]
    );

    const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [
      result.insertId,
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/employees/:id  (update with optional new photo)
router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const {
      employee_name,
      employee_code,
      department,
      designation,
      project,
      type,
      status,
    } = req.body;

    
    const [oldRows] = await pool.query(
      'SELECT photo FROM employees WHERE id = ?',
      [req.params.id]
    );
    const oldPhoto = oldRows[0] ? oldRows[0].photo : null;

    const photoPath = req.file ? `uploads/${req.file.filename}` : oldPhoto;

    await pool.query(
      `UPDATE employees
       SET employee_name = ?, employee_code = ?, department = ?, designation = ?,
           project = ?, type = ?, status = ?, photo = ?
       WHERE id = ?`,
      [
        employee_name,
        employee_code,
        department || null,
        designation || null,
        project || null,
        type || 'Full-time',
        status || 'Active',
        photoPath,
        req.params.id,
      ]
    );

    const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [
      req.params.id,
    ]);
    if (!rows.length) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/employees/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM employees WHERE id = ?', [req.params.id]);
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
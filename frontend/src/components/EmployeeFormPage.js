import React, { useEffect, useState, useRef } from 'react';
import './EmployeeCommon.css';
import './EmployeeFormPage.css';
import { HiOutlineUser } from "react-icons/hi";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import Navbar from './layout/Navbar';

const API_URL = 'http://localhost:5000/api/employees';
const BASE_URL = 'http://localhost:5000/';

const emptyForm = {
  employee_name: '',
  employee_code: '',
  department: '',
  designation: '',
  project: '',
  type: '',
  status: '',
};

function EmployeeFormPage({ mode }) {
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const isEdit = mode === 'edit';

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!isEdit) return;
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/${id}`);
        const emp = res.data;
        setFormData({
          employee_name: emp.employee_name || '',
          employee_code: emp.employee_code || '',
          department: emp.department || '',
          designation: emp.designation || '',
          project: emp.project || '',
          type: emp.type || 'Full-time',
          status: emp.status || 'Active',
        });

        if (emp.photo) {
          setPhotoPreview(BASE_URL + emp.photo);
        }
      } catch (err) {
        console.error(err);
        alert('Failed to load employee');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (photoFile) {
        data.append('photo', photoFile);
      }

      if (isEdit) {
        await axios.put(`${API_URL}/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post(API_URL, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      navigate('/employees');
    } catch (err) {
      console.error(err);
      alert('Failed to save employee');
    }
  };

  const handleCancel = () => {
    navigate('/employees');
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="layout">
      {/* Sidebar as separate component */}
      <Sidebar />

      {/* Main */}
      <main className="main">
        {/* Top navbar (settings, bell, profile) */}
        <Navbar />

        {/* Back + title bar */}
        <header className="topbar form-topbar">
          <div className="topbar-left">
            <button
              className="back-btn"
              type="button"
              onClick={() => navigate('/employees')}
            >
              ←
            </button>
            <h1 className="page-title">
              {isEdit ? 'Edit Employee' : 'Add New Employee'}
            </h1>
          </div>
        </header>

        <section className="card">
          {/* Tab header */}
          <div className="tab-header">
  <button className="tab active">
    <span className="tab-icon">
      <HiOutlineUser size={18} />
    </span>
    Personal Information
  </button>
</div>

          {loading ? (
            <div className="center-message">Loading...</div>
          ) : (
            <form
              className="form-two-column"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              {/* Photo upload */}
              <div className="photo-wrapper">
                <div className="photo-box" onClick={openFileDialog}>
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Employee"
                      className="photo-img"
                    />
                  ) : (
                    <span className="camera-icon">📷</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
              </div>

              {/* Row 1 */}
              <div className="form-row">
                <label className="form-field">
                  Name*
                  <input
                    name="employee_name"
                    placeholder="Enter name"
                    value={formData.employee_name}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="form-field">
                  Employee ID*
                  <input
                    name="employee_code"
                    placeholder="Enter employee ID"
                    value={formData.employee_code}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              {/* Row 2 */}
              <div className="form-row">
                <label className="form-field">
                  Department*
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="HR">HR</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Sales">Sales</option>
                    <option value="Finance">Design</option>
                  </select>
                </label>

                <label className="form-field">
                  Designation*
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select designation</option>
                    <option value="Developer">Developer</option>
                    <option value="Team Lead">Design Lead</option>
                    <option value="Manager">Manager</option>
                  </select>
                </label>
              </div>

              {/* Row 3 */}
              <div className="form-row">
                <label className="form-field">
                  Project
                  <input
                    name="project"
                    placeholder="Enter Project"
                    value={formData.project}
                    onChange={handleChange}
                  />
                </label>

                <label className="form-field">
                  Type*
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Office</option>
                    <option value="Intern">Intern</option>
                  </select>
                </label>
              </div>

              {/* Row 4 */}
              <div className="form-row">
                <label className="form-field">
                  Status*
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Permanent</option>
                    <option value="Inactive">Temporary</option>
                  </select>
                </label>
              </div>

              {/* Buttons */}
              <div className="form-actions-right">
                <button type="button" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Update
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}

export default EmployeeFormPage;
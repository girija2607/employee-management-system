// src/components/EmployeeListPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EmployeeCommon.css';
import './EmployeeListPage.css';
import Sidebar from './layout/Sidebar';
import Navbar from './layout/Navbar';
import { LuEye, LuPencil, LuTrash2 } from 'react-icons/lu';
import { FiSearch } from 'react-icons/fi';     
import { FiPlusCircle } from "react-icons/fi";

const API_URL = 'http://localhost:5000/api/employees';
const BASE_URL = 'http://localhost:5000/';

function EmployeeListPage() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const navigate = useNavigate();

  const fetchEmployees = async (searchQuery = '') => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(API_URL, {
        params: { search: searchQuery || undefined },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchEmployees(value);
  };

  const openDeleteModal = (emp) => {
    setEmployeeToDelete(emp);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    try {
      await axios.delete(`${API_URL}/${employeeToDelete.id}`);
      await fetchEmployees(search);
    } catch (err) {
      console.error(err);
      alert('Failed to delete employee');
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      <main className="main">
        <Navbar />

        <header className="topbar">
          <h1 className="page-title">Employee</h1>
          <div className="topbar-right">
<div className="search-box">
  <FiSearch className="search-icon-ui" />
  <input
    className="search-input-ui"
    type="text"
    placeholder="Search"
    value={search}
    onChange={handleSearchChange}
  />
</div>

            <button className="primary-btn" onClick={() => navigate('/employees/new')}>
  <FiPlusCircle size={20} className="plus-icon" />
  Add New Employee
</button>
          </div>
        </header>

        <section className="card">
          {loading && <div className="center-message">Loading...</div>}
          {error && <div className="error-message">{error}</div>}

          {!loading && !employees.length && !error && (
            <div className="center-message">No records found</div>
          )}

          {!loading && !!employees.length && (
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Project</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="employee-name-cell">
                        {emp.photo && (
                          <img
                            src={BASE_URL + emp.photo}
                            alt={emp.employee_name}
                            className="avatar"
                          />
                        )}
                        <span>{emp.employee_name}</span>
                      </div>
                    </td>
                    <td>{emp.employee_code}</td>
                    <td>{emp.department}</td>
                    <td>{emp.designation}</td>
                    <td>{emp.project}</td>
                    <td>{emp.type}</td>
                    <td>{emp.status}</td>
                    <td>
                      <button
                        className="icon-btn"
                        title="View"
                        onClick={() => navigate(`/employees/${emp.id}`)}
                      >
                        <LuEye size={18} />
                      </button>
                      <button
                        className="icon-btn"
                        title="Edit"
                        onClick={() => navigate(`/employees/${emp.id}/edit`)}
                      >
                        <LuPencil size={18} />
                      </button>
                      <button
                        className="icon-btn "
                        title="Delete"
                        onClick={() => openDeleteModal(emp)}
                      >
                        <LuTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {showDeleteModal && (
          <div className="delete-modal-backdrop">
            <div className="delete-modal">
              <div className="delete-icon">
                <LuTrash2 size={32} />
              </div>
              <p className="delete-text">
                Are you sure you want to delete
                <br />
                <strong>{employeeToDelete?.employee_name}</strong>?
              </p>
              <div className="delete-actions">
                <button
                  className="delete-btn cancel"
                  type="button"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </button>
                <button
                  className="delete-btn confirm"
                  type="button"
                  onClick={confirmDelete}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default EmployeeListPage;
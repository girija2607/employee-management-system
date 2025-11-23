import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './EmployeeCommon.css';
import './EmployeeViewPage.css';
import Sidebar from './layout/Sidebar';
import Navbar from './layout/Navbar';
import { HiOutlineUser } from "react-icons/hi";

const API_URL = 'http://localhost:5000/api/employees';
const BASE_URL = 'http://localhost:5000/';

function EmployeeViewPage() {
  const [emp, setEmp] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/${id}`);
        setEmp(res.data);
      } catch (e) {
        console.error(e);
        alert('Failed to load employee');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading || !emp) {
    return (
      <div className="layout">
        <Sidebar />
        <main className="main">
          <Navbar />
          <header className="topbar form-topbar">
            <div className="topbar-left">
              <button
                className="back-btn"
                type="button"
                onClick={() => navigate('/employees')}
              >
                ←
              </button>
              <h1 className="page-title">View Employee Details</h1>
            </div>
          </header>
          <section className="card">
            <div className="center-message">Loading...</div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar />

      <main className="main">
        <Navbar />

        <header className="topbar form-topbar">
          <div className="topbar-left">
            <button
              className="back-btn"
              type="button"
              onClick={() => navigate('/employees')}
            >
              ←
            </button>
            <h1 className="page-title">View Employee Details</h1>
          </div>
        </header>

        <section className="card">
          <div className="tab-header">
  <button className="tab active">
    <span className="tab-icon">
      <HiOutlineUser size={18} />
    </span>
    Personal Information
  </button>
</div>

          <div className="view-container">
            <div className="view-top-row">
              <div className="view-photo">
                {emp.photo && (
                  <img
                    src={BASE_URL + emp.photo}
                    alt={emp.employee_name}
                    className="avatar-large"
                  />
                )}
              </div>
            </div>

            <div className="view-fields">
              <div className="view-row-two-col">
                <div className="field-block">
                  <div className="field-label">Name</div>
                  <div className="field-value">{emp.employee_name}</div>
                </div>
                <div className="field-block">
                  <div className="field-label">Employee ID</div>
                  <div className="field-value">{emp.employee_code}</div>
                </div>
              </div>

              <div className="view-row-two-col">
                <div className="field-block">
                  <div className="field-label">Department</div>
                  <div className="field-value">{emp.department}</div>
                </div>
                <div className="field-block">
                  <div className="field-label">Designation</div>
                  <div className="field-value">{emp.designation}</div>
                </div>
              </div>

              <div className="view-row-two-col">
                <div className="field-block">
                  <div className="field-label">Project</div>
                  <div className="field-value">{emp.project}</div>
                </div>
                <div className="field-block">
                  <div className="field-label">Type</div>
                  <div className="field-value">{emp.type}</div>
                </div>
              </div>

              <div className="view-row-single">
                <div className="field-block">
                  <div className="field-label">Status</div>
                  <div className="field-value">{emp.status}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default EmployeeViewPage;
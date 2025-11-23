import { FiSettings, FiBell } from "react-icons/fi";
import '../EmployeeCommon.css';

function Navbar() {
  const profileImage = "/profile.jpeg"; 

  return (
    <div className="main-header">
      <div className="header-icons">

       
        <button className="header-icon-circle" title="Settings">
          <FiSettings size={18} />
        </button>

     
        <button className="header-icon-circle" title="Notifications">
          <FiBell size={18} />
        </button>

        
        <div className="header-avatar-circle profile-img-wrapper">
          <img
            src={profileImage}
            alt="User"
            className="profile-img"
          />
        </div>

      </div>
    </div>
    
  );
}

export default Navbar;
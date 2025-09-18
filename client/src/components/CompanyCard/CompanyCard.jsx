// import styles from './CompanyCard.module.css';

// const CompanyCard = ({ company, onEdit, onDelete }) => {
//   return (
//     <div className={styles.companyCard}>
//       <div className={styles.companyImage}>
//         <img src={company.image} alt={company.name} />
//         <div className={styles.companyOverlay}>
//           <button 
//             onClick={() => onEdit(company)}
//             className={`${styles.overlayBtn} ${styles.editBtn}`}
//           >
//             Edit
//           </button>
//           <button 
//             onClick={() => onDelete(company._id || company.id)}
//             className={`${styles.overlayBtn} ${styles.deleteBtn}`}
//           >
//             Delete
//           </button>
//         </div>
//       </div>
      
//       <div className={styles.companyInfo}>
//         <h3 className={styles.companyName}>{company.name}</h3>
//         <p className={styles.companyCategory}>{company.industry}</p>
//         <p className={styles.companyDescription}>{company.description}</p>
//         <div className={styles.companyMeta}>
//           <div className={styles.metaRow}>
//             <span>📍 {company.location || 'Location not specified'}</span>
//             <span>👥 {Number(company.size || company.employeeCount || 0).toLocaleString()} employees</span>
//           </div>
//           <div className={styles.metaRow}>
//             <span>📅 Founded: {company.foundedYear}</span>
//             <span className={`${styles.status} ${company.isActive ? styles.active : styles.inactive}`}>
//               {company.isActive ? '✅ Active' : '❌ Inactive'}
//             </span>
//           </div>
//           {company.createdAt && (
//             <div className={styles.metaRow}>
//               <span>📝 Added: {new Date(company.createdAt).toLocaleDateString()}</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CompanyCard;

import styles from './CompanyCard.module.css';
import { FaLocationDot, FaUsers } from 'react-icons/fa6';
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaRegFileAlt } from 'react-icons/fa';

const CompanyCard = ({ company, onEdit, onDelete }) => {
  return (
    <div className={styles.companyCard}>
      <div className={styles.companyImage}>
        <img src={company.image} alt={company.name} />
        <div className={styles.companyOverlay}>
          <button 
            onClick={() => onEdit(company)}
            className={`${styles.overlayBtn} ${styles.editBtn}`}
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(company._id || company.id)}
            className={`${styles.overlayBtn} ${styles.deleteBtn}`}
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className={styles.companyInfo}>
        <h3 className={styles.companyName}>{company.name}</h3>
        <p className={styles.companyCategory}>{company.industry}</p>
        <p className={styles.companyDescription}>{company.description}</p>
        <div className={styles.companyMeta}>
          <div className={styles.metaRow}>
            <span><FaLocationDot /> {company.location || 'Location not specified'}</span>
            <span><FaUsers /> {Number(company.size || company.employeeCount || 0).toLocaleString()} employees</span>
          </div>
          <div className={styles.metaRow}>
            <span><FaCalendarAlt /> Founded: {company.foundedYear}</span>
            <span className={`${styles.status} ${company.isActive ? styles.active : styles.inactive}`}>
              {company.isActive ? <><FaCheckCircle /> Active</> : <><FaTimesCircle /> Inactive</>}
            </span>
          </div>
          {company.createdAt && (
            <div className={styles.metaRow}>
              <span><FaRegFileAlt /> Added: {new Date(company.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;

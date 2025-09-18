import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import styles from './CompanyModal.module.css';

const CompanyModal = ({ isOpen, onClose, onSubmit, company, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
    size: '',
    foundedYear: '',
    isActive: true,
    description: '',
    image: null,
    imagePreview: ''
  });

  const industries = ['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail'];
  const locations = ['New York', 'San Francisco', 'London', 'Berlin', 'India'];

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        industry: company.industry || '',
        location: company.location || '',
        size: company.size?.toString() || company.employeeCount?.toString() || '',
        foundedYear: company.foundedYear?.toString() || '',
        isActive: company.isActive !== undefined ? company.isActive : true,
        description: company.description || '',
        image: null,
        imagePreview: company.image
      });
    } else {
      setFormData({
        name: '',
        industry: '',
        location: '',
        size: '',
        foundedYear: '',
        isActive: true,
        description: '',
        image: null,
        imagePreview: ''
      });
    }
  }, [company, isOpen]);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData({
            ...formData,
            image: file,
            imagePreview: e.target.result
          });
        };
        reader.readAsDataURL(file);
      }
    } else if (e.target.name === 'isActive') {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value === 'true'
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Please fill in name and description');
      return;
    }

    const foundedYear = formData.foundedYear ? parseInt(formData.foundedYear, 10) : null;
    const size = formData.size ? parseInt(formData.size, 10) : null;
    
    if (foundedYear && (isNaN(foundedYear) || foundedYear < 1000 || foundedYear > new Date().getFullYear())) {
      toast.error('Please enter a valid founded year');
      return;
    }
    if (size && (isNaN(size) || size < 0)) {
      toast.error('Please enter a valid employee count');
      return;
    }

    const companyData = {
      ...formData,
      id: company ? (company._id || company.id) : Date.now(),
      image: formData.image
    };

    onSubmit(companyData);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{company ? 'Edit Company' : 'Add New Company'}</h2>
          <button className={styles.modalClose} onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Company Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter company name"
              className={styles.input}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="industry">Industry</label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Select industry</option>
                {industries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="foundedYear">Founded Year</label>
              <input
                type="number"
                id="foundedYear"
                name="foundedYear"
                value={formData.foundedYear}
                onChange={handleChange}
                placeholder="e.g., 1998"
                min="1000"
                max={new Date().getFullYear()}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="location">Location</label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Select location</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="size">Employee Count</label>
              <input
                type="number"
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="e.g., 5000"
                min="0"
                step="1"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="isActive">Status</label>
              <select
                id="isActive"
                name="isActive"
                value={formData.isActive}
                onChange={handleChange}
                className={styles.select}
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter company description"
              rows="3"
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image">Company Image/Logo</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              accept="image/*"
              className={styles.fileInput}
            />
            {(formData.imagePreview || (company && company.image)) && (
              <div className={styles.imagePreview}>
                <img src={formData.imagePreview || company.image} alt="Preview" />
                {company && !formData.image && (
                  <p className={styles.imageNote}>Current image (select new image to replace)</p>
                )}
              </div>
            )}
          </div>

          <div className={styles.modalActions}>
            <button 
              type="button" 
              onClick={onClose} 
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className={styles.spinner}></span>
                  {company ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                company ? 'Update Company' : 'Add Company'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

CompanyModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  company: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default CompanyModal;



import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
 
import Navbar from '../../components/Navbar/Navbar';
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar';
import CompanyCard from '../../components/CompanyCard/CompanyCard';
import CompanyModal from '../../components/CompanyModal/CompanyModal';
import Modal from '../../components/Modal/Modal';
import styles from './CompanyListPage.module.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CompanyListPage = () => {
  const [companies, setCompanies] = useState([]);
  const [nameQuery, setNameQuery] = useState('');
  const [descriptionQuery, setDescriptionQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [sizeMin, setSizeMin] = useState('');
  const [sizeMax, setSizeMax] = useState('');
  const [foundedStart, setFoundedStart] = useState('');
  const [foundedEnd, setFoundedEnd] = useState('');
  const [isActive, setIsActive] = useState(''); // '', 'true', 'false'
  const [isLoading, setIsLoading] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCompanyId, setDeletingCompanyId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const industries = ['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail'];
  const locations = ['New York', 'San Francisco', 'London', 'Berlin', 'India'];

  const loadCompanies = useCallback(
    async (filters = {}) => {
      try {
        setIsLoading(true);
        const queryParams = new URLSearchParams();
        if (filters.name) queryParams.append('name', filters.name);
        if (filters.description) queryParams.append('description', filters.description);
        if (filters.industry && filters.industry.length) queryParams.append('industry', filters.industry.join(','));
        if (filters.location && filters.location.length) queryParams.append('location', filters.location.join(','));
        if (filters.sizeMin !== undefined && filters.sizeMin !== '') queryParams.append('sizeMin', filters.sizeMin);
        if (filters.sizeMax !== undefined && filters.sizeMax !== '') queryParams.append('sizeMax', filters.sizeMax);
        if (filters.foundedStart !== undefined && filters.foundedStart !== '') queryParams.append('foundedStart', filters.foundedStart);
        if (filters.foundedEnd !== undefined && filters.foundedEnd !== '') queryParams.append('foundedEnd', filters.foundedEnd);
        if (filters.isActive !== undefined && filters.isActive !== '') queryParams.append('isActive', filters.isActive);
        queryParams.append('page', filters.page || 1);
        queryParams.append('limit', filters.limit || limit);

        const url = `${API_BASE_URL}/api/companies?${queryParams.toString()}`;

        const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });

        if (!response.ok) throw new Error('Failed to fetch companies');

        const data = await response.json();

        if (data.success && Array.isArray(data.companies)) {
          setCompanies(data.companies);
          setPage(Number(data.page) || 1);
          setTotalPages(Number(data.totalPages) || 1);
          setTotalItems(Number(data.totalItems) || 0);
        } else {
          setCompanies([]);
          setTotalPages(1);
          setTotalItems(0);
        }
      } catch (error) {
        console.error('Error loading companies:', error);
        toast.error('Failed to load companies');
      } finally {
        setIsLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filters = {
        name: nameQuery,
        description: descriptionQuery,
        industry: selectedIndustries,
        location: selectedLocations,
        sizeMin,
        sizeMax,
        foundedStart,
        foundedEnd,
        isActive,
        page,
        limit,
      };
      loadCompanies(filters);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [nameQuery, descriptionQuery, selectedIndustries, selectedLocations, sizeMin, sizeMax, foundedStart, foundedEnd, isActive, page, limit, loadCompanies]);

  const handleNameChange = (value) => {
    setPage(1);
    setNameQuery(value);
    setDescriptionQuery(value);
  };
  const handleDescriptionChange = () => {};
  const handleCategoryChange = (industries) => {
    setPage(1);
    setSelectedIndustries(industries);
  };
  const handleLocationsChange = (locs) => { setPage(1); setSelectedLocations(locs); };
  const handleSizeChange = (min, max) => { setPage(1); setSizeMin(min); setSizeMax(max); };
  const handleFoundedChange = (start, end) => { setPage(1); setFoundedStart(start); setFoundedEnd(end); };
  const handleActiveChange = (val) => { setPage(1); setIsActive(val); };

  const clearAllFilters = () => {
    setNameQuery('');
    setDescriptionQuery('');
    setSelectedIndustries([]);
    setSelectedLocations([]);
    setSizeMin('');
    setSizeMax('');
    setFoundedStart('');
    setFoundedEnd('');
    setIsActive('');
    setPage(1);
  };

  const goToPage = (targetPage) => {
    if (targetPage < 1 || targetPage > totalPages || targetPage === page) return;
    setPage(targetPage);
  };
  const goPrev = () => goToPage(page - 1);
  const goNext = () => goToPage(page + 1);

  const handleAddCompany = () => {
    setEditingCompany(null);
    setIsCompanyModalOpen(true);
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setIsCompanyModalOpen(true);
  };

  const handleDeleteCompany = (companyId) => {
    setDeletingCompanyId(companyId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(
        `${API_BASE_URL}/api/companies/${deletingCompanyId}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      toast.success('Company deleted successfully!');
      await loadCompanies({ page, limit });
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error(error.message || 'Failed to delete company');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setDeletingCompanyId(null);
    }
  };

  const handleCompanySubmit = async (companyData) => {
    const isEdit = Boolean(editingCompany);
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append('name', companyData.name);
      formData.append('industry', companyData.industry || '');
      formData.append('location', companyData.location || '');
      formData.append('size', companyData.size || '');
      formData.append('foundedYear', companyData.foundedYear || '');
      formData.append('isActive', companyData.isActive);
      formData.append('description', companyData.description);

      if (companyData.image && companyData.image instanceof File) {
        formData.append('image', companyData.image);
      }

      const url = isEdit
        ? `${API_BASE_URL}/api/companies/${editingCompany._id || editingCompany.id}`
        : `${API_BASE_URL}/api/companies`;

      const response = await fetch(url, { method: isEdit ? 'PUT' : 'POST', body: formData });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      toast.success(isEdit ? 'Company updated successfully!' : 'Company added successfully!');
      setIsCompanyModalOpen(false);
      setEditingCompany(null);
      await loadCompanies({ page, limit });
    } catch (error) {
      console.error('Error submitting company:', error);
      toast.error(error.message || 'Failed to save company');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className={styles.companyListPage}>
      <Navbar onToggleSidebar={handleToggleSidebar} />

      <div className={styles.container}>
        <div className={styles.breadcrumb}></div>

        <div className={styles.headerSection}>
          <div className={styles.headerRow}>
            <div className={styles.pageTitle}>
              <h1>Companies</h1>
              <p>Manage company records and details</p>
            </div>
            <button onClick={handleAddCompany} className={styles.addButton}>
              <span className={styles.addIcon}>+</span> Add Company
            </button>
          </div>

          <div className={styles.searchRow}>
            <div className={styles.searchContainer}>
              <div className={styles.searchInputWrapper}>
                <span className={styles.searchIcon} aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.5 15.5L21 21" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="10.5" cy="10.5" r="6.5" stroke="#666" strokeWidth="2"/>
                  </svg>
                </span>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search companies by name or description..."
                  value={nameQuery}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          
        </div>

        <div className={styles.contentLayout}>
          <div className={styles.sidebar}>
            <FilterSidebar
              categories={industries}
              selectedCategories={selectedIndustries}
              onCategoryChange={handleCategoryChange}
              locations={locations}
              selectedLocations={selectedLocations}
              onLocationsChange={handleLocationsChange}
              nameQuery={nameQuery}
              onNameChange={handleNameChange}
              descriptionQuery={descriptionQuery}
              onDescriptionChange={handleDescriptionChange}
              sizeMin={sizeMin}
              sizeMax={sizeMax}
              onSizeChange={handleSizeChange}
              foundedStart={foundedStart}
              foundedEnd={foundedEnd}
              onFoundedChange={handleFoundedChange}
              isActive={isActive}
              onActiveChange={handleActiveChange}
              isOpen={isSidebarOpen}
              onToggle={handleToggleSidebar}
              onReset={clearAllFilters}
            />
          </div>

          <div className={styles.mainContent}>
            {isLoading && companies.length === 0 ? (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading companies...</p>
              </div>
            ) : companies.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No companies found matching your criteria.</p>
              </div>
            ) : (
              <>
                <div className={styles.companiesGrid}>
                  {companies.map((company) => (
                    <CompanyCard
                      key={company._id || company.id}
                      company={company}
                      onEdit={handleEditCompany}
                      onDelete={handleDeleteCompany}
                    />
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                  <button onClick={goPrev} disabled={page <= 1} className={styles.addButton} style={{ padding: '8px 12px' }} aria-label="Previous page">
                    ◀
                  </button>
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1)
                    .slice(Math.max(0, page - 3), Math.max(0, page - 3) + 5)
                    .map((p) => (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={styles.addButton}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: p === page ? '#1f2937' : undefined,
                          color: p === page ? '#fff' : undefined,
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  <button onClick={goNext} disabled={page >= totalPages} className={styles.addButton} style={{ padding: '8px 12px' }} aria-label="Next page">
                    ▶
                  </button>
                </div>
                <div style={{ textAlign: 'center', marginTop: '8px', color: '#6b7280' }}>
                  Showing page {page} of {totalPages} ({totalItems} items)
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <CompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsCompanyModalOpen(false);
            setEditingCompany(null);
          }
        }}
        onSubmit={handleCompanySubmit}
        company={editingCompany}
        isLoading={isSubmitting}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        title="Delete Company"
        message="Are you sure you want to delete this company? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setDeletingCompanyId(null);
          }
        }}
        type="danger"
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
};

CompanyListPage.propTypes = {};

export default CompanyListPage;



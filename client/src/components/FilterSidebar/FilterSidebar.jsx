import styles from './FilterSidebar.module.css';

const FilterSidebar = ({ 
  categories, 
  selectedCategories, 
  onCategoryChange, 
  locations,
  selectedLocations,
  onLocationsChange,
  sizeMin,
  sizeMax,
  onSizeChange,
  foundedStart,
  foundedEnd,
  onFoundedChange,
  isActive,
  onActiveChange,
  isOpen,
  onToggle,
  onReset
}) => {
  const handleCategoryToggle = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    onCategoryChange(updatedCategories);
  };

  const handleLocationToggle = (loc) => {
    const updated = selectedLocations.includes(loc)
      ? selectedLocations.filter(l => l !== loc)
      : [...selectedLocations, loc];
    onLocationsChange(updated);
  };

  return (
    <>
      <div 
        className={`${styles.sidebarOverlay} ${isOpen ? styles.active : ''}`}
        onClick={onToggle}
      />
      
      <div className={`${styles.filterSidebar} ${isOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarHeader}>
            <h3>Filters</h3>
            <button className={styles.mobileClose} onClick={onToggle}>×</button>
          </div>
          
          
          
          <div className={styles.sidebarSection}>
            <h4>Industry</h4>
            <div className={styles.filterContent}>
              <div className={styles.sortOptions}>
                {categories.map((category) => (
                  <label key={category} className={styles.sortOption}>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                    />
                    <span className={styles.checkboxMark}></span>
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.sidebarSection}>
            <h4>Location</h4>
            <div className={styles.filterContent}>
              <div className={styles.sortOptions}>
                {locations.map((loc) => (
                  <label key={loc} className={styles.sortOption}>
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(loc)}
                      onChange={() => handleLocationToggle(loc)}
                    />
                    <span className={styles.checkboxMark}></span>
                    <span>{loc}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.sidebarSection}>
            <h4>Size (employees)</h4>
            <div className={styles.filterContent}>
              <input
                type="number"
                placeholder="Min"
                value={sizeMin}
                onChange={(e) => onSizeChange(e.target.value, sizeMax)}
                style={{ width: '100%', padding: '10px', border: '1px solid #e5e5e5', borderRadius: '8px' }}
                min="0"
              />
              <input
                type="number"
                placeholder="Max"
                value={sizeMax}
                onChange={(e) => onSizeChange(sizeMin, e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #e5e5e5', borderRadius: '8px', marginTop: '8px' }}
                min="0"
              />
            </div>
          </div>
          <div className={styles.sidebarSection}>
            <h4>Founded Year</h4>
            <div className={styles.filterContent}>
              <input
                type="number"
                placeholder="Start year"
                value={foundedStart}
                onChange={(e) => onFoundedChange(e.target.value, foundedEnd)}
                style={{ width: '100%', padding: '10px', border: '1px solid #e5e5e5', borderRadius: '8px' }}
              />
              <input
                type="number"
                placeholder="End year"
                value={foundedEnd}
                onChange={(e) => onFoundedChange(foundedStart, e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #e5e5e5', borderRadius: '8px', marginTop: '8px' }}
              />
            </div>
          </div>
          <div className={styles.sidebarSection}>
            <h4>Status</h4>
            <div className={styles.sortOptions}>
              <label className={styles.sortOption}>
                <input
                  type="radio"
                  name="active"
                  value=""
                  checked={isActive === ''}
                  onChange={() => onActiveChange('')}
                />
                <span className={styles.radioMark}></span>
                <span>Any</span>
              </label>
              <label className={styles.sortOption}>
                <input
                  type="radio"
                  name="active"
                  value="true"
                  checked={isActive === 'true'}
                  onChange={(e) => onActiveChange(e.target.value)}
                />
                <span className={styles.radioMark}></span>
                <span>Active</span>
              </label>
              <label className={styles.sortOption}>
                <input
                  type="radio"
                  name="active"
                  value="false"
                  checked={isActive === 'false'}
                  onChange={(e) => onActiveChange(e.target.value)}
                />
                <span className={styles.radioMark}></span>
                <span>Inactive</span>
              </label>
            </div>
          </div>
          <div className={styles.sidebarSection}>
            <button 
              type="button" 
              onClick={onReset} 
              style={{ width: '100%', padding: '10px 12px', background: '#e5e7eb', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}
            >
              Reset filters
            </button>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
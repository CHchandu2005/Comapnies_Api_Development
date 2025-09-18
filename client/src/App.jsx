import { ToastContainer } from 'react-toastify';
import CompanyListPage from './pages/CompanyListPage/CompanyListPage';
import 'react-toastify/dist/ReactToastify.css';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.app}>
      <CompanyListPage />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName={styles.toast}
        bodyClassName={styles.toastBody}
        progressClassName={styles.toastProgress}
      />
    </div>
  );
}

export default App;
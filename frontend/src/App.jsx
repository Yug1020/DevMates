import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from "react-redux";
import appStore from "./util/store";
import './App.css';

import ProtectedRoutes from './util/ProtectedRoutes.jsx';
import Dashboard from './pages/Dashboard';
import Login from './pages/login';
import SignUp from './pages/signUp';

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected layout — all child routes are managed inside Dashboard */}
          <Route
            path="/*"
            element={
              <ProtectedRoutes>
                <Dashboard />
              </ProtectedRoutes>
            }
          />
          {/* Fallback */}
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

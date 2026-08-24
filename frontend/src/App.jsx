import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from "react-redux";
import appStore from "./util/store";
import './App.css';

import ProtectedRoutes from './util/ProtectedRoutes.jsx';
import Login from './pages/login';
import SignUp from './pages/signUp';

import Dashboard from './pages/Dashboard';
import Home from './components/Home.jsx';
import Connections from './components/Connections.jsx';
import Profile from './components/Profile';
import Error from './components/Error';
import Requests from './components/Requests.jsx';
import Messages from './components/Messages.jsx';

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected routes wrapped in security check */}
          <Route element={<ProtectedRoutes />}>
            {/* Dashboard acts as the visual parent layout */}
            <Route path="/" element={<Dashboard />}>
              {/* Default view at "/" */}
              <Route index element={<Home />} />
              
              {/* Sub-pages at "/network" and "/profile" */}
              <Route path="network" element={<Connections />} />
              <Route path="profile" element={<Profile />} />
              <Route path="requests" element={<Requests/>}/>
              <Route path="messages" element={<Messages/>}/>
              
              {/* Error fallback inside the dashboard */}
              <Route path="*" element={<Error />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

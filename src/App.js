
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import SignIn from './pages/Auth/Signin';
import { UserSignUp, AdminSignUp } from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import './global.css';
import Cases from './pages/Cases/Cases';
import Users from './pages/Users/Users';
import Predict from './pages/Predict/Predict';
import Suspects from './pages/Suspects/Suspects';
import Evidence from './pages/Evidence/Evidence';
import AddEvidence from './pages/Evidence/AddEvidence';

// context api
import { DataContextProvider } from './context/DataContext';

function App() {
  return (
    <DataContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<UserSignUp />} />
          <Route path="/admin/user/signup" element={<AdminSignUp />} />
          <Route path="/user/dashboard/:id" element={<Dashboard />} />
          <Route path="/user/cases" element={<Cases />} />
          <Route path="/user/users" element={<Users />} />
          <Route path="/user/predict" element={<Predict />} />
          <Route path="/user/suspects" element={<Suspects />} />
          <Route path="/user/evidence" element={<Evidence />} />
          <Route path="/user/addEvidence" element={<AddEvidence />} />
        </Routes>
      </Router>
    </DataContextProvider>
  );
}

export default App;

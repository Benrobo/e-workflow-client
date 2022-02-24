
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import SignIn from './pages/Auth/Signin';
import { UserSignUp, AdminSignUp } from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import './global.css';
import { DataContextProvider } from './context/DataContext';
import { Util } from "./helpers/util"
import Code from './pages/Code/Code';
import SendMail from './pages/SendMail/SendMail';

let util = new Util()

function App() {

  return (
    <DataContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={util.isLoggedIn() ? <Dashboard /> : <SignIn />} />
          <Route path="/signin" element={util.isLoggedIn() ? <Dashboard /> : <SignIn />} />
          <Route path="/signup" element={util.isLoggedIn() ? <Dashboard /> : <UserSignUp />} />
          <Route path="/admin/user/signup" element={util.isLoggedIn() ? <Dashboard /> : <AdminSignUp />} />
          <Route path="/user/dashboard/:id" element={util.isLoggedIn() ? <Dashboard /> : <SignIn />} />
          <Route path="/user/code/" element={util.isLoggedIn() ? <Code /> : <SignIn />} />
          <Route path="/user/sendMail/" element={util.isLoggedIn() ? <SendMail /> : <SignIn />} />
        </Routes>
      </Router>
    </DataContextProvider>
  );
}

export default App;

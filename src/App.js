
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
import Collab from './pages/Colab/Collab';
import Meeting from './pages/Meeting/meeting';
import Submissions from './pages/Documents/Submissions';
import CreateDocument from './pages/Documents/CreateDoc';
import Request from './pages/Request/Request';
import Groups from './pages/Group/Groups';
import Settings from './pages/Settings/Settings';
import Permissions from './pages/Permission/Permission';
import Notifications from './pages/Notification/Notification';
import Notfound from './pages/Notfound/Notfound';
import Users from './pages/Users/Users';

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
          <Route path="/user/collab/" element={util.isLoggedIn() ? <Collab /> : <SignIn />} />
          <Route path="/user/meeting/:id" element={util.isLoggedIn() ? <Meeting /> : <SignIn />} />
          <Route path="/user/settings" element={util.isLoggedIn() ? <Settings /> : <SignIn />} />
          <Route path="/user/submissions" element={util.isLoggedIn() ? <Submissions /> : <SignIn />} />
          <Route path="/user/addDocument" element={util.isLoggedIn() ? <CreateDocument /> : <SignIn />} />
          <Route path="/user/request" element={util.isLoggedIn() ? <Request /> : <SignIn />} />
          <Route path="/user/groups" element={util.isLoggedIn() ? <Groups /> : <SignIn />} />
          <Route path="/user/permission" element={util.isLoggedIn() ? <Permissions /> : <SignIn />} />
          <Route path="/user/notifications" element={util.isLoggedIn() ? <Notifications /> : <SignIn />} />
          <Route path="/user/users" element={util.isLoggedIn() ? <Users /> : <SignIn />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </Router>
    </DataContextProvider>
  );
}

export default App;

import './App.css';
import SignIn from './Templates/SignIn';
import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Home from './Templates/Home';
import Navbar from './Templates/Navbar';
import SignUp from './Templates/SignUp';
import Events from './Templates/Events';
import About from './Templates/About';
import Event from './Templates/Event';
import Verify from './Templates/Verify';
import Profile from './Templates/Profile';
import CheckEvent from './Templates/CheckEvents';
import EditDb from './Templates/EditDb';
import EditAny from './Templates/EditAny';
import AddAny from './Templates/AddAny';
import ManageAny from './Templates/ManageAny';
import AssignEvents from './Templates/AssignEvents';
import ManageEvent from './Templates/ManageEvent';
import AddWinners from './Templates/AddWinners';
import SeeLogistics from './Templates/SeeLogistics';
import Leaderboard from './Templates/Leaderboard';

export const UserProvider = React.createContext();
function App() {
  const [Loggedin, setLoggedin] = React.useState(false);
  const [userType, setUserType] = React.useState("");
  return (
    <div className="body">
      <Router>
        <UserProvider.Provider
          value={{ Loggedin, setLoggedin, userType, setUserType }}
        >
          <Navbar />
          <div className="App">
          <Route path="/signin" component={SignIn} />
          <Route exact path="/" component={Home} />
          <Route path="/signup" component={SignUp} />
          <Route path="/events" component={Events} />
          <Route path="/about" component={About} />
          <Route path="/event/:id" component={Event} />
          <Route path="/verify-email/:id" component={Verify} />
          <Route path="/profile" component={Profile} />
          <Route path="/checkevents" component={CheckEvent} />
          <Route path="/editdb" component={EditDb} />
          <Route path="/manage/:name" component={EditAny} />
          <Route path="/add/:name" component={AddAny} />
          <Route path="/edit/:name" component={ManageAny} />
          <Route path="/assignevent" component={AssignEvents} />
          <Route path="/manageevents" component={ManageEvent} />
          <Route path="/addwinners" component={AddWinners} />
          <Route path="/seelogistics" component={SeeLogistics} />
          <Route path="/leaderboard/:eventId" component={Leaderboard} />
          </div>
        </UserProvider.Provider>
      </Router>
    </div>
  );
}

export default App;

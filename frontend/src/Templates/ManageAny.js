import "./ManageAny.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { UserProvider } from "../App";
import { useContext } from "react";
import { Redirect } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ManageAny() {
    const { Loggedin, setLoggedin } = useContext(UserProvider);
    const Organizertypes = ['Event coordinator','Logistics manager','Marketing specialist','Technical lead','Volunteer coordinator'];
    const {name} = useParams();
    const [Data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectState, setSelectState] = useState('');
    const history = useHistory();
    const HandleVolunteer = (userId) => {
        axios.post('http://localhost:5002/setasvolunteer', { userId: userId },{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
            .then(response => {
                alert('Registered for volunteer successfully');
                window.location.reload();
                })
            .catch(error => {
                alert(error);
            })
    };
    const HandleSdelete = (userId) => {
        axios.post('http://localhost:5002/deletestudent', { userId: userId },{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
            .then(response => {
                alert('Deleted successfully');
                window.location.reload();
                })
            .catch(error => {
                alert(error);
            })
    };
    const HandlePdelete = (userId) => {
        axios.post('http://localhost:5002/deleteparticipant', { userId: userId },{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
            .then(response => {
                alert('Deleted successfully');
                window.location.reload();
                })
            .catch(error => {
                alert(error);
            })
    };
    const HandleOdelete = (userId) => {
        axios.post('http://localhost:5002/deleteorganizer', { userId: userId },{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
            .then(response => {
                alert('Deleted successfully');
                window.location.reload();
                })
            .catch(error => {
                alert(error);
            })
    }
    const RemoveVol = (userId) => {
        axios.post('http://localhost:5002/removevolunteer', { userId: userId },{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
            .then(response => {
                alert('Removed from volunteer successfully');
                window.location.reload();
                })
            .catch(error => {
                alert(error);
            })
    };
    const printDateTime = (date, time) => {
        const eventDate = new Date(`${date}T${time}`);
        return eventDate.toLocaleString();
    }
    const HandleEdelete = (eventId) => {
        axios.post('http://localhost:5002/deleteevent', { eventId: eventId },{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
            .then(response => {
                alert('Deleted successfully');
                window.location.reload();
                })
            .catch(error => {
                alert(error);
            })
    }
    useEffect(() => {
        axios.get(`http://localhost:5002/getall${name}`,{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
            .then(response => {
                setData(response.data);
                console.log(response.data);
                setLoading(false);
            }).catch(error => {
                console.log(error);
            });
    }, []);
    const HandleAssignType = (userId,type) => {
        console.log(type);
        if(Organizertypes.indexOf(type) === -1){
            alert('Invalid type');
            return;
        }
        axios.post('http://localhost:5002/settpeorg', { userId: userId, type: type },{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
            .then(response => {
                alert('Type assigned successfully');
                window.location.reload();
            }).catch(error => {
                alert(error);
            })
    }
    const HandleClick = (id) => {
        return <Redirect to={{
            pathname: '/assignevent',
            state: { id: id }
        }} />
    };

    if(!Loggedin) {
        return <a href='/signin'><button>Sign In</button></a>
    }
    if(localStorage.getItem('userType') !== 'admin'){
        console.log(localStorage.getItem('userType'));
        return <a href='/profile'><button>Profile</button></a>
    }
    if(loading || Data.length === 0){
        return <h1>Loading...</h1>
    }
    if(name === 'organizers'){
        return (
            <div className="ManageAny">
                <h1>Edit Organizers</h1>
                <div className="ManageAny-Options">
                    <table>
                        <tr>
                            <th>Organizer ID</th>
                            <th>Organizer Name</th>
                            <th>Email</th>
                            <th>Type</th>
                            <th>Assign Events</th>
                            <th>Delete Account</th>
                        </tr>
                        {Data.map((organizer) => {
                            return (
                                <tr>
                                    <td>{organizer.id}</td>
                                    <td>{organizer.firstname + ' '+ organizer.lastname}</td>
                                    <td>{organizer.emailid}</td>
                                    <td>{organizer.organisertype == null ?(<div className="type"><select
                                    name="type" id="type" onChange={()=>{
                                        setSelectState(document.getElementById('type').value);
                                        console.log(selectState);
                                    }}><option value="" disabled>
                                    Select User Type
                                    </option>{Organizertypes.map((type) => {
                                        return <option value={type}>{type}</option>
                                    })}</select><button onClick={()=>HandleAssignType(organizer.id,selectState)}>Assign Type</button></div>):organizer.organisertype}</td>
                                    <td>{<Link to={{pathname: '/assignevent',state: { id: organizer.id }}}><button >Assign Events</button></Link>}</td>
                                    <td>{<button onClick={() => HandleOdelete(organizer.id)}>Delete</button>}</td>
                                </tr>
                            )
                        })}
                    </table>
                </div>
            </div>
        )
    }
    if(name === 'students'){
        //display in form of table with id,name,emailid, delete button
        return (
            <div className="ManageAny">
                <h1>Edit Students</h1>
                <div className="ManageAny-Options">
                    <table>
                        <tr>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Email</th>
                            <th>Volunteer</th>
                            <th>Delete Account</th>
                        </tr>
                        {Data.map((student) => {
                            return (
                                <tr>
                                    <td>{student.id}</td>
                                    <td>{student.firstname + ' '+ student.lastname}</td>
                                    <td>{student.emailid}</td>
                                    <td>{student.isvolunteer?<button onClick={() => RemoveVol(student.id)}>Remove as volunteer</button>:<button onClick={() => HandleVolunteer(student.id)}>Make Volunteer</button>}</td>
                                    <td>{<button onClick={() => HandleSdelete(student.id)}>Delete</button>}</td>
                                </tr>
                            )
                        })}
                    </table>
                </div>
            </div>
        )
    }
    if(name === 'participants'){
        //display in form of table with id,name,emailid, delete button
        return (
            <div className="ManageAny">
                <h1>Edit Participants</h1>
                <div className="ManageAny-Options">
                    <table>
                        <tr>
                            <th>Participant ID</th>
                            <th>Participant Name</th>
                            <th>Email</th>
                            <th>Delete Account</th>
                        </tr>
                        {Data.map((participant) => {
                            return (
                                <tr>
                                    <td>{participant.id}</td>
                                    <td>{participant.firstname + ' '+ participant.lastname}</td>
                                    <td>{participant.emailid}</td>
                                    <td>{<button onClick={() => HandlePdelete(participant.id)}>Delete</button>}</td>
                                </tr>
                            )
                        })}
                    </table>
                </div>
            </div>
        )
    }
    if(name === 'events'){
        //display in form of table with event name,event time,prize, delete button until the event is over
        return (
            <div className="ManageAny">
                <h1>Edit Events</h1>
                <div className="ManageAny-Options">
                    <table>
                        <tr>
                            <th>Event ID</th>
                            <th>Event Name</th>
                            <th>Event Time</th>
                            <th>Prize</th>
                            <th>Delete Event</th>
                        </tr>
                        {Data.map((event) => {
                            return (
                                <tr>
                                    <td>{event.id}</td>
                                    <td>{event.name}</td>
                                    <td>{printDateTime(event.date,event.time)}</td>
                                    <td>{event.prize}</td>
                                    <td>{<button onClick={() => HandleEdelete(event.id)}>Delete</button>}</td>
                                </tr>
                            )
                        })}
                    </table>
                </div>
            </div>
        )
    }
}

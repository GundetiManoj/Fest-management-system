import "./AddWinners.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { UserProvider } from "../App";
import { useContext } from "react";
import { Redirect } from "react-router-dom";
import { useParams } from "react-router-dom";


export default function Leaderboard() {
    const { Loggedin, setLoggedin } = useContext(UserProvider);
    const {eventId} = useParams();
    const [winners, setWinners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [winnerids, setWinnerids] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5002/getwinners/${eventId}`,{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
            .then(response => {
                setWinners(response.data);
                console.log(response.data);
            }).catch(error => {
                console.log(error);
            });
        axios.get(`http://localhost:5002/getwinnersid/${eventId}`,{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
        .then(response => {
            setWinnerids(response.data);
            console.log(response.data);
            setLoading(false);
        }).catch(error => {
            console.log(error);
        });
    }, []);
    if(!Loggedin) {
        return <a href='/signin'><button>Sign In</button></a>
    }
    if(localStorage.getItem('userType') !== 'participant' && localStorage.getItem('userType') !== 'student'){
        console.log(localStorage.getItem('userType'));
        return <a href='/profile'><button>Profile</button></a>
    }
    if(loading || winners.length === 0 || winnerids.length === 0){
        return <h1>Loading...</h1>
    }
    if(winners.length > 0){
        //print it in form of table showinf name,emailid and position using winnerids
        const winnersdata = [];
        for(let i=0;i<winners.length;i++){
            if(winners[i].id == winnerids[0].firstprizewinnerid){
                winnersdata.push(winners[i]);
            }
        }
        for(let i=0;i<winners.length;i++){
            if(winners[i].id == winnerids[0].secondprizewinnerid){
                winnersdata.push(winners[i]);
            }
        }
        for(let i=0;i<winners.length;i++){
            if(winners[i].id == winnerids[0].thirdprizewinnerid){
                winnersdata.push(winners[i]);
            }
        }
        return (
            <div className='AddWinners'>
                <h1>Winners</h1>
                <div className='AddWinners-List'>
                    <table>
                        <tr>
                            <th>Position</th>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                        <tr>
                            <td>1st</td>
                            <td>{winnersdata[0].firstname + ' ' + winnersdata[0].lastname}</td>
                            <td>{winnersdata[0].emailid}</td>
                        </tr>
                        <tr>
                            <td>2nd</td>
                            <td>{winnersdata[1].firstname + ' ' + winnersdata[1].lastname}</td>
                            <td>{winnersdata[1].emailid}</td>
                        </tr>
                        <tr>
                            <td>3rd</td>
                            <td>{winnersdata[2].firstname + ' ' + winnersdata[2].lastname}</td>
                            <td>{winnersdata[2].emailid}</td>
                        </tr>
                    </table>
                </div>
            </div>
        );
    }
}
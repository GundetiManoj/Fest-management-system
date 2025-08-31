import React, { useEffect } from 'react';
import './Navbar.css'
import { useContext } from 'react';
import { UserProvider } from '../App';

export default function Navbar() {
    const { Loggedin , setLoggedin } = useContext(UserProvider);
    useEffect(() => {
    if(localStorage.getItem('token') !== null ){
        const date1 = new Date(localStorage.getItem('token'));
        const date = new Date();
        if(date1 > date){
            setLoggedin(true)
            console.log(Loggedin);
        }else{
            setLoggedin(false)
            console.log('Logged out');
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('userType');
        }
    }
    else{
        setLoggedin(false);
    }})
    return (
        <div className='Navbar'>
            <div className='Navbar-Logo'>
                <h1>Event Management System</h1>
            </div>
            <div className='Navbar-Links'>
                <a href='/'>Home</a>
                {localStorage.getItem("userType") == "organizer"?<a href='/manageevents'>Manage Events</a>:localStorage.getItem("userType") != "admin"?<a href='/events'>Events</a> : <a href='/editdb'>Edit DB</a>}
                <a href='/about'>About</a>
                <a href='/contact'>Contact</a>
                {Loggedin ? <a href='/profile'>Profile</a> : <a href='/signin'>Sign In</a>}
            </div>
        </div>
    );
}
import React from 'react';
import { useNavigate } from "react-router-dom";


const Header = (props) => {
    let navigate = useNavigate();

    const navTo = (route) => {
        navigate("/" + route);
    }
    return (<div className='header'>
        <span className={props.nav==='search'?'nav-btn nav-border':'nav-btn'} onClick={() => navTo('search')}>Search</span>
        <span className={props.nav==='bookings'?'nav-btn nav-border':'nav-btn'} onClick={() => navTo('bookings')}>My Bookings</span>
    </div>)
}
export default Header
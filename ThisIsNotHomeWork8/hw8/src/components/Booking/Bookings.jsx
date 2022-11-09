import React, { useState } from 'react';
import Header from '../Header/Header';
import { Table } from 'react-bootstrap';
import './booking.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
function Bookings(props) {
    const bookings = localStorage.getItem('reservations') ? JSON.parse(localStorage.getItem('reservations')).list : []
    const [arr, setArr] = useState(bookings);

    const cancelReservation = (key) => {
        let ls = localStorage.getItem('reservations') ? JSON.parse(localStorage.getItem('reservations')).list : [];
        ls = ls.filter(x => x.key !== key)
        localStorage.setItem('reservations',
            JSON.stringify({ list: [...ls] }));
        setArr(ls)
        alert('Reservation cancelled!')
    }
    return (
        <div className='booking-page container-1 row'>
            <Header nav='bookings' />
            <div className='bus-tabel-cnt'>
                <h4>List of your Reservations</h4>
                {arr.length > 0 ? <>
                    <br></br>
                    <Table className='booking-tab-cnt' size='sm'>
                        <thead>
                            <tr>
                                <th className='tab-ind'>#</th>
                                <th>Business Name</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Email</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {arr.map((data, index) => (
                                <tr >
                                    <td className='booking-index'>{index + 1}</td>
                                    <td className=''>{data.name}</td>
                                    <td className=''>{data.date}</td>
                                    <td className=''>{(data.th.length === 1 ? ('0' + data.th) : data.th)}:{data.tm
                                    }</td>
                                    <td className=''>{data.email}</td>
                                    <td className=''><FontAwesomeIcon className='ptr' icon={faTrashCan} onClick={() => { cancelReservation(data.key) }}></FontAwesomeIcon></td>
                                </tr>))}
                        </tbody>
                    </Table>

                </> : <>
                    <div className='no-res'>No reservations to show</div>
                </>
            }
        </div>
        </div>

    )
}
export default Bookings
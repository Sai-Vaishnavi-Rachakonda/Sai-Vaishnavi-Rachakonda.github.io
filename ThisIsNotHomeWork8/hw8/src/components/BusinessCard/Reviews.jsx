import React from 'react';
import { Table } from 'react-bootstrap';
import './review.css'
function Reviews(props) {
    const { reviews } = props;
    return (reviews.length > 0 ? <>
        <div className='reviews-tabel-cnt'>
            <Table striped className=''>
                <tbody>
                    {reviews.map((data, index) => (<tr id={data.id} key={index} onClick={() => props.onRowClick(data.id)} className='cursor-ptr'>
                        <td className='review-row'>
                            <p className='review-name'>{data.user.name}</p>
                            <p className='ratings'>Rating:{data.rating}/5</p>
                            <p className='review-text'>{data.text}</p>
                            <p className='date'>{data.time_created.split(' ')[0]}</p>
                        </td>
                    </tr>))}
                </tbody>
            </Table>
        </div>
    </> : <>
        {/* TODO: No results table */}
    </>)
}
export default Reviews
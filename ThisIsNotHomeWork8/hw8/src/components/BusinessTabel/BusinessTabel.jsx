import React from 'react';
import { Table } from 'react-bootstrap';
import './businesstabel.css'

const BusinessTabel = (props) => {
    const business = props.businesses
    return(business.length>0?<>
    <div className='business-tabel-cnt'>
        <Table striped className='tab-cnt' size="sm">
        <thead>
        <tr>
          <th className='tab-ind'>#</th>
          <th >Image</th>
          <th >Business Name</th>
          <th >Rating</th>
          <th >Distance (miles)</th>
         {/*  <th className='tab-ind width-1'>#</th>
          <th className='tab-img-td width-1'>Image</th>
          <th className='tab-buss-name width-3'>Business Name</th>
          <th className='tab-rating width-1'>Rating</th>
          <th className='tab-distance width-2'>Distance (miles)</th> */}
        </tr>
      </thead>
      <tbody>
        {business.map((data,index)=>(<tr id={data.id} key ={data.id} onClick={()=>props.onRowClick(data.id)} className='cursor-ptr'>
            <td className='tab-ind width-1'>{index+1}</td>
            <td className='tab-img-td width-1'><img src={data.image_url} alt={data.name} className='row-image'></img></td>
            <td className='tab-buss-name width-3'>{data.name}</td>
            <td className='tab-rating width-1'>{data.rating}</td>
            <td className='tab-distance width-2'>{(data.distance* 0.000621371192).toFixed(2)}</td>
        </tr>))}
        </tbody>
        </Table>
    </div>
    </>:<>
    <div className='btn-row'>
      <div className='no-res'>No results available</div>
    </div>
    </>)
}
export default BusinessTabel
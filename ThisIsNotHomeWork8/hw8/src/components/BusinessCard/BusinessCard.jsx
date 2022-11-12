import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faClock } from '@fortawesome/free-solid-svg-icons'
import './businessCard.css'
import Map from './Map';
import Reviews from './Reviews';
import Modal from 'react-bootstrap/Modal';
import { Col, Form } from 'react-bootstrap';
import { faClockFour } from '@fortawesome/free-regular-svg-icons';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import { faSquareFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (

    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function BusinessCard(props) {
  const { cardDetails: data } = props
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };
  const [showModal, setShowModal] = useState(false)
  const [validated, setValidated] = useState(false)
  const [submitClicked, setSubmitClicked] = useState(false)
  const [err, setErr] = useState({ email: '', date: '' })
  const [email, setEmail] = useState('')
  const [date, setDate] = useState()
  const [timeHours, setTimeHours] = useState()
  const [timeMins, setTimeMins] = useState()
  const [reserved, setReserved] = useState(false)
  const [slides, setSlides] = useState(false)
  const getConcat = (value, seprator) => {
    let str = ''
    for (let i in value) {
      str += value[i] ? (value[i].title ? value[i].title : value[i]) + seprator : ''
    }
    return str.slice(0, str.length - 3)
  }

  useEffect(() => {
    let ls = localStorage.getItem('reservations') ? JSON.parse(localStorage.getItem('reservations')).list : [];
    let newls = ls.filter(x => x.name == name)
    if (newls.length > 0)
      setReserved(true)
    else
      setReserved(false)
    // console.log(ls)
  })
  const closeModal = () => {
    if (showModal) {
      setShowModal(false);
      setValidated(false);
      setEmail('')
      setDate()
      setTimeHours()
      setTimeMins()
      setErr({ email: '', date: '' })
    }

  }
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const onSubmitReservation = (event) => {
    const form = event.currentTarget;
    setSubmitClicked(true)
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      if (!validateEmail(email) && email.length > 0) {
        setErr({ ...err, email: "Email must be a valid emai address" })
      }
    }
    else {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      if (setValuesInLS()) {
        alert('Reservation Created!');
        closeModal();
        setReserved(true)
      }


    }
  }
  const setValuesInLS = () => {
    let key = email + date + timeHours + timeMins + name;
    let ls = localStorage.getItem('reservations') ? JSON.parse(localStorage.getItem('reservations')).list : []
    localStorage.setItem('reservations',
      JSON.stringify({ list: [...ls, { name: name, key: key, email: email, date: date, th: timeHours, tm: timeMins }] }))
    return true
  }
  const cancelReservation = () => {
    let ls = localStorage.getItem('reservations') ? JSON.parse(localStorage.getItem('reservations')).list : [];
    ls = ls.filter(x => x.name != name)
    localStorage.setItem('reservations',
      JSON.stringify({ list: [...ls] }));
    setReserved(false);
    alert('Reservation Cancelled!')
  }
  const arr24 = new Array(8).fill(9);
  const arr60 = ['00', '15', '30', '45']
  const formChange = (e, name1) => {
    let val = e.target.value
    switch (name1) {
      case ('email'): {
        setEmail(val);
        if (submitClicked) {
          if (email.length == 0) {
            setErr({ ...err, email: "Email is required" })
          }
          else if (!validateEmail(email) && email.length > 0) {
            setErr({ ...err, email: "Email must be a valid email address" })
          }

        }
        break;
      }
      case ('date'): {
        setDate(val);
        break;
      }
      case ('timeHrs'): {
        setTimeHours(val);
        break;
      }
      case ('timeMins'): {
        setTimeMins(val);
        break;
      }
      default:
        {
          console.log(e, e.target.value, name1)
          break;
        }
    }
  }
  let minDate = new Date().toLocaleDateString().split('/')
  minDate = minDate[2] + '-' + minDate[0] + '-' + (minDate[1].length == 1 ? '0' + minDate[1] : minDate[1])
  // console.log(minDate)
  let { hours, location, categories,
    display_phone, price, url, name, photos, coordinates
  } = data;
  let status = hours && [0] && ['is_open_now'];
  let address = getConcat(location.display_address, '   ');
  // let transactionSupported = getConcat(transactions, ' | ');
  let category = getConcat(categories, ' | ');
  let phone = display_phone;
  price = price && price.length > 0 ? price : ''
  // console.log(status, address, category, phone, price, url, name, photos);
  let twitterUrl = 'https://twitter.com/intent/tweet?text=Check ' + name + ' on Yelp.   ' + url;

  const position = {
    lat: coordinates.latitude,
    lng: coordinates.longitude
  }

  const setSlideInterval =()=>{
    setSlides(true)

  }
  return (
    <div className='card-detail-cnt'>
      <div className='card-dets'>
        {/* TODO: decrese the thinkness of icon */}
        <FontAwesomeIcon icon={faArrowLeft} className='align-left ptr' onClick={props.onBackClick} />
        <p className='card-header'>{name}</p>
        {/* <AppBar position="static"> */}
        <Tabs
          onChange={handleChange}
          variant="scrollable"
          scrollButtons
          value={value}
          allowScrollButtonsMobile
          fullWidth={true}
          centered
          indicatorColor="secondary"
          sx={{
            backgroundColor: '#FFD740',
            // display: 'inline-block',
            width: '100%',
            height: '4vh',
            justifyContent: 'center',
            flexDirection: 'row'
          }}
          aria-label="scrollable auto tabs example"
        >
          <Tab sx={{ color: '#7E6A20 !important', textTransform: 'none' }} label="Business details" {...a11yProps(0)} />
          <Tab sx={{ color: '#7E6A20 !important', textTransform: 'none' }} label="Map location" {...a11yProps(1)} />
          <Tab sx={{ color: '#7E6A20 !important', textTransform: 'none' }} label="Reviews" {...a11yProps(2)} />
        </Tabs>
        {/* </AppBar> */}
        <SwipeableViews
          axis={'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div className='business-details row'>
              <div className='row'>
              <div className='col-md-6 col-sm-12'>
                {address && <div class="row">
                  <span class="block-header">Address</span>
                  <div class="block-content">
                    <span class={''}>{address}</span>
                  </div>
                </div>}
                {phone && <div class="row">
                  <span class="block-header">Phone</span>
                  <div class="block-content">
                    <span class={''}>{phone}</span>
                  </div>
                </div>}
                <div class="row">
                  <span class="block-header">Status</span>
                  <div class="block-content">
                    <span class={status ? 'green' : 'red'}>{status ? "Open Now" : "Closed"}</span>
                  </div>
                </div>
              </div>

              <div className='col-md-6 col-sm-12'>
                {category && <div class="row">
                  <span class="block-header">Category</span>
                  <div class="block-content">
                    <span class={''}>{category}</span>
                  </div>
                </div>}

                {price && <div class="row">
                  <span class="block-header">Price range</span>
                  <div class="block-content">
                    <span class={''}>{price}</span>
                  </div>
                </div>}

                {url && <div class="row">
                  <span class="block-header">Visit Yelp for more</span>
                  <div class="block-content">
                    <a href={url} target="blank">Business Link</a>
                  </div>
                </div>}
              </div>
              </div>
              <div className='btn-row row'>
                {!reserved ? <Button variant="danger" className='reserve-btn' onClick={() => { setShowModal(true) }}>
                  Reserve Now
                </Button> : <Button variant="primary" className='cancel-reserve-btn' onClick={cancelReservation}>
                  Cancel Reservation
                </Button>}
              </div>
              <div className='share-row'>
                <span className='share-on'>Share on:</span>
                <a href={twitterUrl} target='_blank'>
                  <FontAwesomeIcon icon={faTwitter} className='share-icon twitter' />
                </a>
                <a target="_blank" href={"https://www.facebook.com/sharer/sharer.php?u=" + url} >
                  <FontAwesomeIcon icon={faSquareFacebook} className='share-icon facebook' />
                </a>
              </div>
              {photos.length > 0 && <Carousel 
              variant="dark" 
              className='' 
              data-ride= {false}
              onSlide={setSlideInterval}
              pause={false}
              interval={slides?1000:null}>
                {photos.map(photo => (<Carousel.Item>
                  <div className='btn-row'>
                    <img
                      className="card-img"
                      src={photo}
                      alt={name}
                    /></div>
                </Carousel.Item>))}
              </Carousel>}
            </div>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <Map position={position} />
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <Reviews reviews={props.reviews} />
          </TabPanel>
        </SwipeableViews>
      </div>
      <>
        <Modal show={showModal} onHide={closeModal} backdrop="static">
          <Modal.Header>
            <Modal.Title>Reservation Form</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className=''>
              <div className='btn-row row'> <h4 className='modal-buss-name'>{name}</h4> </div>
              <Form noValidate validated={validated} onSubmit={onSubmitReservation}>
                <Form.Group as={Col} md="12" controlId="validationCustom01">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    onChange={(e) => formChange(e, 'email')}
                    value={email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {err.email ? err.email : "Email is required"}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="12" controlId="validationCustom02">
                  <Form.Label>Date</Form.Label>
                  <Form.Control type="date"
                    required
                    // name='date_of_resevation'
                    min={minDate}
                    value={date}
                    onChange={(e) => formChange(e, 'date')}
                  />
                  <Form.Control.Feedback type="invalid">
                    Date is required.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className=''
                  controlId="validationCustom03">
                  <Form.Label>Time</Form.Label>
                  <div className='middle'>
                    <Form.Select
                      required
                      className='col-3 padd-right'
                      onChange={(e) => formChange(e, 'timeHrs')}
                      value={timeHours}
                    ><option value={''}>{''}</option>
                      {arr24.map((val, index) => (<option value={(index + 10).toString()}>
                        {(index + 10).toString()}</option>))
                      }
                    </Form.Select>:
                    <Form.Select
                      required className='col-3 padd-right-5'
                      onChange={(e) => { formChange(e, 'timeMins') }}
                      value={timeMins}
                    ><option value={''}>{''}</option>
                      {arr60.map((val, index) => (<option value={val}>{val}</option>))}</Form.Select>
                    <FontAwesomeIcon icon={faClockFour} className='padd-left' />

                  </div>
                </Form.Group>
                <div className='row btn-row'>
                  <Button type="submit" className='submit-btn'>Submit</Button>
                </div>
              </Form>

            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="dark" onClick={closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </div>
  );
}

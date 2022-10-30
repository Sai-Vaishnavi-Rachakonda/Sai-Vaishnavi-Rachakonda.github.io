import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { faArrowLeft,faClock } from '@fortawesome/free-solid-svg-icons'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Carousel from 'react-bootstrap/Carousel';
import Modal from 'react-bootstrap/Modal';
import './businessCard.css'
import Button from 'react-bootstrap/Button';
import { faSquareFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { Col, Form, Row } from 'react-bootstrap';
import { faClockFour } from '@fortawesome/free-regular-svg-icons';


const BusinessCard = (props) => {
    console.log(props)
    const { cardDetails: data } = props
    const [showModal, setShowModal] = useState(false)
    const [validated, setValidated] = useState(false)

    const getConcat = (value, seprator) => {
        let str = ''
        for (let i in value) {
            str += value[i] ? (value[i].title ? value[i].title : value[i]) + seprator : ''
        }
        return str.slice(0, str.length - 3)
    }

    const closeModal = () => {
        if (showModal) {
            setShowModal(false);
            setValidated(false)
        }

    }

    const onSubmitReservation = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
    }
    let minDate = new Date().toLocaleDateString().split('/')
    minDate = minDate[2] + '-' + minDate[0] + '-' + minDate[1]
    console.log(minDate)
    let { hours, location, transactions, categories,
        display_phone, price, url, name, photos
    } = data;
    let status = hours && [0] && ['is_open_now'];
    let address = getConcat(location.display_address, '   ');
    // let transactionSupported = getConcat(transactions, ' | ');
    let category = getConcat(categories, ' | ');
    let phone = display_phone;
    price = price && price.length > 0 ? price : ''
    // console.log(status, address, category, phone, price, url, name, photos);
    let twitterUrl = 'https://twitter.com/intent/tweet?text=Check ' + name + ' on Yelp.   ' + url;

    return (<div className='card-detail-cnt'>
        <div className='card-dets'>
            {/* TODO: decrese the thinkness of icon */}
            <FontAwesomeIcon icon={faArrowLeft} className='align-left' onClick={props.onBackClick} />
            <p className='card-header'>{name}</p>
            <Tabs
                defaultActiveKey="busDets"
                id="uncontrolled-tab-example"
                className="nav-header"
            >
                {/* TODO: add checks */}
                <Tab eventKey="busDets" title="Business Details">
                    <div className='business-details row'>
                        <div class="col-6">
                            <span class="block-header">Address</span>
                            <div class="block-content">
                                <span class={''}>{address}</span>
                            </div>
                        </div>
                        <div class="col-6">
                            <span class="block-header">Category</span>
                            <div class="block-content">
                                <span class={''}>{category}</span>
                            </div>
                        </div>
                        <div class="col-6">
                            <span class="block-header">Phone</span>
                            <div class="block-content">
                                <span class={''}>{phone}</span>
                            </div>
                        </div>
                        <div class="col-6">
                            <span class="block-header">Price range</span>
                            <div class="block-content">
                                <span class={''}>{price}</span>
                            </div>
                        </div>
                        <div class="col-6">
                            <span class="block-header">Status</span>
                            <div class="block-content">
                                <span class={status ? 'green' : 'red'}>{status ? "Open Now" : "Closed"}</span>
                            </div>
                        </div>
                        <div class="col-6">
                            <span class="block-header">Visit Yelp for more</span>
                            <div class="block-content">
                                <a href={url} target="blank">Business Link</a>
                            </div>
                        </div>
                        <div className='btn-row row'>
                            <Button variant="danger" className='reserve-btn' onClick={() => { setShowModal(true) }}>
                                Reserve Now
                            </Button>
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
                        <Carousel variant="dark" className='img-cnt'>
                            {photos.map(photo => (<Carousel.Item interval={1000}>
                                <div className='btn-row'>
                                    <img
                                        className="card-img"
                                        src={photo}
                                        alt={name}
                                    /></div>
                            </Carousel.Item>))}
                        </Carousel>
                    </div>
                </Tab>
                <Tab eventKey="map" title="Map location">
                    2
                </Tab>
                <Tab eventKey="review" title="Reviews" >
                    3
                </Tab>
            </Tabs>
        </div>
        <>
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header>
                    <Modal.Title>Reservation Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='conatiner'>
                        <h3 className='modal-buss-name row'>{name}</h3>
                        <Form noValidate validated={validated} onSubmit={onSubmitReservation}>
                            <Form.Group as={Col} md="4" controlId="validationCustom01">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    required
                                    type="email"
                                />
                            </Form.Group>
                            {/* <Form.Control.Feedback type="invalid">
                                Please provide a valid city.
                            </Form.Control.Feedback> */}
                            <Form.Control type="date" name='date_of_birth' min={minDate} />
                            <Form.Group as={Col} md="4" controlId="validationCustom01">
                                <Form.Label>Time</Form.Label>
                                <Form.Control
                                    required
                                    type="number"
                                    min={0}
                                    max={23}
                                />
                                <Form.Control
                                    required
                                    type="number"
                                    min={0}
                                    max={59}
                                />
                                <FontAwesomeIcon icon={faClockFour}/>
                            </Form.Group>
                            <Button type="submit">Submit form</Button>
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
export default BusinessCard
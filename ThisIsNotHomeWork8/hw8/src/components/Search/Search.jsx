import React, { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Header from '../Header/Header';
import './search.css';
import { Checkbox } from '@mui/material';
import BusinessTabel from '../BusinessTabel/BusinessTabel';
import BusinessCard from '../BusinessCard/BusinessCard';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { Form, Spinner } from 'react-bootstrap';


function Search(props) {

    const proxy = "https://node-react-project-365904.wl.r.appspot.com/"
    // const proxy = "http://localhost:8080/"
    const [keyWord, setkeyWord] = useState();
    const [kW, setkW] = useState();
    const [keyWordInput, setkeyWordInput] = useState();
    const [openAC, setOpenAC] = useState(false);
    const [keyWordOptions, setKeyWordOptions] = useState([]);
    const [category, setCategory] = useState('all');
    const [distance, setDistance] = useState();
    const [location, setLocation] = useState('');
    const [longLat, setLongLat] = useState({ lat: '', lng: '' })
    const [autoDetectLocation, setAutoDetectLocation] = useState(false);
    const [businesses, setBusinesses] = useState([])
    const [cardDetails, setCardDetails] = useState({})
    const [reviews, setReviews] = useState({})
    const [showTabel, setShowTabel] = useState(false)
    const [showCard, setShowCard] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const ref = useRef();


    useEffect(() => {
        // console.log(location, autoDetectLocation, longLat)
    }, [location, autoDetectLocation, longLat])


    const formChange = async (e, name, value) => {
        // console.log(name, value, e)
        switch (name) {
            case 'autoCompInput':
                {
                    //if enter is pressed we have to close the dd and set value
                    setkeyWordInput(value);
                    break;
                }
            case 'keyWordAutoComplete':
                {
                    // TODO: bug when selected a 
                    setkeyWord(value)
                    setkW(value.label)
                    break;
                }
            case 'category':
                {
                    setCategory(e.target.value);
                    break
                }
            case 'distance':
                {
                    setDistance(e.target.value);
                    break
                }
            case 'location':
                {
                    setLocation(e.target.value);
                    break
                }
            case 'checkbox':
                {
                    setAutoDetectLocation(value)
                    if (value) {
                        getAutoLocation()
                    }
                    else {
                        setLongLat({ lng: '', lat: '' })
                    }
                    setLocation('')
                    break
                }
            default:
                console.log(name, value, e)
        }
    }

    const getAPIObject = {
        method: 'GET',
        header: {
            'Access-Control-Allow-Origin': '*',
        },
    };
    const getOptionsList = async (val) => {
        // console.log(val)
        setkeyWordInput(val);
        setkW(val)
        setIsLoading(true);
        const url = proxy + 'getOptionsList?text=' + val
        await fetch(url, getAPIObject).then(res => {
            if (res && res.status === 200)
                return res.json()
            throw ('err in geting auto complete data')
        }).then(res => {
            let data = res.data
            let options = []
            // if (data.businesses && data.businesses.length > 0) {
            //     data.businesses.map((option, ind) => options.push({ label: option.title, id: ind }))
            // }
            if (data.categories && data.categories.length > 0) {
                data.categories.map((option, ind) => options.push({ label: option.title, id: ind }))
            }
            if (data.terms && data.terms.length > 0) {
                data.terms.map((option, ind) => options.push({ label: option.text, id: ind }))
            }
            setKeyWordOptions(options)
        })
            .catch(e => { console.log(e) })
        setOpenAC(true)
        setIsLoading(false)

    }
    const closeAutoComplete = () => {
        if (openAC) {
            setOpenAC(false)
        }
    }

    const getLocation = async () => {
        const addressURL = proxy+'getLocation?location=' + location;
        await fetch(addressURL, getAPIObject)
            .then(res => {
                if (res && res.status === 200)
                    return res.json()
                else throw ('There was an error fetching long and lat')
            }
            ).then(data => {
                // console.log(data)
                if (data && data.data.results && data.data.results[0] && data.data.results[0].geometry && data.data.results[0].geometry.location)
                    setLongLat(data.data.results[0].geometry.location)
                else
                    throw ('data from google api is missing')
            }).catch(e => console.log(e))
    }

    const getAutoLocation = async () => {
        const locURL = 'https://ipinfo.io?token=d86e1ea0fedc63'
        await fetch(locURL, getAPIObject)
            .then(res => {
                if (res && res.status === 200)
                    return res.json()
                else throw ('There was an error fetching long and lat')
            }
            ).then(data => {
                // console.log(data)
                if (data && data.loc) {
                    const { loc } = data
                    setLongLat({
                        lat: parseFloat(loc.split(',')[0]),
                        lng: parseFloat(loc.split(',')[1])
                    })
                }
                else {
                    throw ('error fetching address from ip')
                }
            })
            .catch(e => console.log(e))
    }

    const submitForm = async (event) => {
        if(kW.length>0&&(location.length>0||longLat.lat!='') ){
        if (showCard) {
            setCardDetails({});
            setBusinesses([]);
            setShowCard(false)
        }
        let url = proxy + 'getDets?keyWord=' + kW + '&&distance=' + (parseInt((distance ? distance : 0) * 1609.344)) + '&&category=' + category +'&&location='+location +'&&locationLat=' + longLat.lat + '&&locationLong=' + longLat.lng
        await fetch(url, getAPIObject)
            .then((response) => {
                return response.json()
            }).then((res) => {
                if (res && res.data && res.data.businesses) {
                    // console.log(res.data)
                    setBusinesses(res.data.businesses)
                    setShowTabel(true)
                }
                else {
                    if(res.data&&res.data.error){
                        alert(res.data.error.description)
                    }
                    throw ('no businesses data array found')
                }
            }).catch((exception) => {
                console.log(exception);
            });
        }

    }
    const onSubmitForm = (event) => {
        event.preventDefault();
        event.stopPropagation();
    }
    const clearForm = () => {
        ref.current?.clear()
        setShowCard(false)
        setShowTabel(false)
        setBusinesses([])
        setAutoDetectLocation(false)
        setkeyWord({})
        setkW('')
        setkeyWordInput({})
        setOpenAC(false)
        setKeyWordOptions([])
        setCategory('all')
        setDistance('')
        setLocation('')
        setLongLat({ lat: '', lng: '' })
        setAutoDetectLocation(false)
        setCardDetails({})
        // console.log(keyWord, keyWordInput)
    }

    const onRowClick = async (id) => {
        // console.log(id)
        let url = proxy + 'getBusinessDets?id=' + id;
        await fetch(url, getAPIObject)
            .then((response) => {
                // console.log(response);
                return response.json()
            }).then((data) => {
                // console.log(data);
                if (data) {
                    setCardDetails(data.data)
                    setShowTabel(false)
                    setShowCard(true)
                }
                else throw ('no businesses details found')
            }).catch((exception) => {
                console.log(exception);
            });
        let url2 = proxy + 'getBusinessReviews?id=' + id;
        await fetch(url2, getAPIObject)
            .then((response) => {
                // console.log(response);
                return response.json()
            }).then((data) => {
                // console.log(data);
                if (data && data.data && data.data.reviews) {
                    setReviews(data.data.reviews)
                }
                else throw ('no businesses details found')
            }).catch((exception) => {
                console.log(exception);
            });
    }

    const backBtnClick = () => {
        setShowCard(false)
        setShowTabel(true)
    }
    return (<div className=''>
        <div className='search-page container-1 row'>
            <Header nav='search' />
            <div className='search-form-cnt col-md-6 col-sm-8' >
                <Form className='form' onSubmit={onSubmitForm} >
                    <p className='form-title'>Business search</p>
                    <div className='search-form'>
                        <div className='row dist-cat-row'>
                            <div className="col-12">
                                <label className=''>Keyword <span className='req'>*</span></label>
                                <AsyncTypeahead
                                    filterBy={() => true}
                                    id="async-example"
                                    isLoading={isLoading}
                                    required
                                    minLength={3}
                                    inputProps={{
                                        required: true,
                                    }}
                                    ref={ref}
                                    labelKey="label"
                                    // onInputChange={(keyword, e) => formChange(e, 'autoCompInput', keyword)}
                                    onChange={(keyword, e) => formChange(e, 'keyWordAutoComplete', keyword[0])}
                                    onSearch={getOptionsList}
                                    options={keyWordOptions}
                                    searchText={<Spinner
                                        className='zIndex'
                                        size="sm"
                                        variant="dark" animation="border" />}
                                    renderMenuItemChildren={(option) => (
                                        <>
                                            <span>{option.label}</span>
                                        </>
                                    )}
                                ></AsyncTypeahead>

                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-12'>
                                <div className='row dist-cat-row'>
                                    <div className='colmn  col-md-6'>
                                        <label>Distance</label>
                                        <Form.Control type="number" placeholder="10" value={distance}
                                            id='distance'
                                            className='dist'
                                            onChange={(e, val) => formChange(e, 'distance', val)} />
                                    </div>
                                    <div className='colmn col-md-6'>
                                        <label className=''>Category <span className='req'>*</span></label>
                                        <Form.Select
                                            required
                                            className='category-select'
                                            value={category}
                                            variant='light'
                                            style={{ backgroundImage:`url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill=%27none%27 stroke=%27%23343a40%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27m2 5 6 6 6-6%27/%3e%3c/svg%3e")` }}
                                            onChange={(e, val) => formChange(e, 'category', val)}>
                                            <option value={'all'}>Default</option>
                                            <option value={'art-entertainment'}>Arts & Entertainment</option>
                                            <option value={'health'}>Health & Medical</option>
                                            <option value={'hotelstravel'}>Hotels & Travel</option>
                                            <option value={'food'}>Food</option>
                                            <option value={'professional'}>Professional Services</option>
                                        </Form.Select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className=' colmn col-12'>
                            <div className='colmn loc-inp'><label className=''>Location <span className='req'>*</span></label>
                                <Form.Control
                                    value={location}
                                    id='location'
                                    className="rbt rbt-input-main form-control rbt-input"
                                    required={longLat.lat.length <= 0||location.length<=0}
                                    onChange={(e, val) => { formChange(e, 'location', val) }}
                                    disabled={autoDetectLocation}
                                    // onBlur={getLocation}
                                ></Form.Control>
                            </div>
                            <div className='row-align'>
                                <Checkbox checked={autoDetectLocation}
                                    onChange={(e, val) => { formChange(e, 'checkbox', val) }} />
                                <label>Auto-detect my location</label>
                            </div>
                        </div>

                        <div className='center-btns'>
                            <Button variant="danger" type='submit' className='form-btn' onClick={submitForm} >
                                Submit
                            </Button>
                            <Button variant="primary" className='form-btn' onClick={clearForm}>
                                Clear
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>

            {showTabel && <BusinessTabel businesses={businesses} onRowClick={onRowClick} />}
            {showCard && <BusinessCard
                cardDetails={cardDetails}
                reviews={reviews}
                onBackClick={backBtnClick}
                 />}
        </div>
    </div>)
}
export default Search
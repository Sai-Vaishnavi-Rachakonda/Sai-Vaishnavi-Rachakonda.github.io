import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Header from '../Header/Header';
import './search.css';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Checkbox, MenuItem, Select } from '@mui/material';
import BusinessTabel from '../BusinessTabel/BusinessTabel';
import BusinessCard from '../BusinessCard/BusinessCard';


function Search(props) {
    const cardDetsA= {
        "id": "QZulGq646k8J1UfJbfDvhA",
        "alias": "ralphs-los-angeles",
        "name": "Ralphs",
        "image_url": "https://s3-media1.fl.yelpcdn.com/bphoto/5tYaq03O8wEcxH4iSxylOA/o.jpg",
        "is_claimed": true,
        "is_closed": false,
        "url": "https://www.yelp.com/biz/ralphs-los-angeles?adjust_creative=jc4ySiv-rGoQVRd5IY4BAw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_lookup&utm_source=jc4ySiv-rGoQVRd5IY4BAw",
        "phone": "+13237323863",
        "display_phone": "(323) 732-3863",
        "review_count": 203,
        "categories": [
            {
                "alias": "grocery",
                "title": "Grocery"
            }
        ],
        "rating": 3,
        "location": {
            "address1": "2600 S Vermont Ave",
            "address2": "",
            "address3": "",
            "city": "Los Angeles",
            "zip_code": "90007",
            "country": "US",
            "state": "CA",
            "display_address": [
                "2600 S Vermont Ave",
                "Los Angeles, CA 90007"
            ],
            "cross_streets": ""
        },
        "coordinates": {
            "latitude": 34.0320237174903,
            "longitude": -118.290662739486
        },
        "photos": [
            "https://s3-media1.fl.yelpcdn.com/bphoto/5tYaq03O8wEcxH4iSxylOA/o.jpg",
            "https://s3-media4.fl.yelpcdn.com/bphoto/Nmohd8i357zy3zFJDFRWBw/o.jpg",
            "https://s3-media3.fl.yelpcdn.com/bphoto/tFpxrgBp_hyo05VbveZrIw/o.jpg"
        ],
        "price": "$$",
        "hours": [
            {
                "open": [
                    {
                        "is_overnight": true,
                        "start": "0500",
                        "end": "0100",
                        "day": 0
                    },
                    {
                        "is_overnight": true,
                        "start": "0500",
                        "end": "0100",
                        "day": 1
                    },
                    {
                        "is_overnight": true,
                        "start": "0500",
                        "end": "0100",
                        "day": 2
                    },
                    {
                        "is_overnight": true,
                        "start": "0500",
                        "end": "0100",
                        "day": 3
                    },
                    {
                        "is_overnight": true,
                        "start": "0500",
                        "end": "0100",
                        "day": 4
                    },
                    {
                        "is_overnight": true,
                        "start": "0500",
                        "end": "0100",
                        "day": 5
                    },
                    {
                        "is_overnight": true,
                        "start": "0500",
                        "end": "0100",
                        "day": 6
                    }
                ],
                "hours_type": "REGULAR",
                "is_open_now": true
            }
        ],
        "transactions": []
    }
    const proxy = "http://localhost:8080/"
    const [keyWord, setkeyWord] = useState();
    const [keyWordInput, setkeyWordInput] = useState();
    const [openAC, setOpenAC] = useState(false);
    const [keyWordOptions, setKeyWordOptions] = useState([]);
    const [category, setCategory] = useState('all');
    const [distance, setDistance] = useState();
    const [location, setLocation] = useState('');
    const [longLat, setLongLat] = useState({lat:'',lng:''})
    const [autoDetectLocation, setAutoDetectLocation] = useState(false);
    const [businesses,setBusinesses] = useState([])
    const [cardDetails,setCardDetails] = useState({})
    const [reviews,setReviews] = useState({})
    const [showTabel,setShowTabel] = useState(false)
    const [showCard,setShowCard] = useState(false)



    useEffect(() => {
        console.log(location, autoDetectLocation, longLat)
    }, [location, autoDetectLocation, longLat])


    const formChange = async (e, name, value) => {
        //console.log(name, value, e)
        switch (name) {
            case 'autoCompInput':
                {
                    //if enter is pressed we have to close the dd and set value
                    setkeyWordInput(value);
                    if (value.length > 2) {
                        await getOptionsList(value)
                    }
                    break;
                }
            case 'keyWordAutoComplete':
                {
                    // TODO: bug when selected a 
                    setkeyWord(value)
                    setOpenAC(false)
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
                        setLongLat({lng:'',lat:''})
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
        const url = proxy + 'getOptionsList?text=' + val
        await fetch(url, getAPIObject).then(res => {
            if (res && res.status === 200)
                return res.json()
            throw ('err in geting auto complete data')
        }).then(res => {
            let data = res.data
            let options = []
            if (data.businesses && data.businesses.length > 0) {
                data.businesses.map((option, ind) => options.push({ label: option.title, id: ind }))
            }
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

    }
    const closeAutoComplete = () => {
        if (openAC) {
            setOpenAC(false)
        }
    }

    const getLocation = async () => {
        const apiKey = 'AIzaSyDGDvD0izXPSz_65z-iZyznuyDlU-D0Qz0'
        const addressURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location + '&key=' + apiKey;
        await fetch(addressURL, getAPIObject)
            .then(res => {
                if (res && res.status === 200)
                    return res.json()
                else throw ('There was an error fetching long and lat')
            }
            ).then(data => {
                // console.log(data.results[0].geometry.location)
                if (data && data.results && data.results[0] && data.results[0].geometry && data.results[0].geometry.location)
                    setLongLat(data.results[0].geometry.location)
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
                console.log(data)
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

    const submitForm = async() => {
        let url = proxy + 'getDets?keyWord=' + keyWordInput +'&&distance=' + (parseInt(distance * 1609.344)) + '&&category=' + category +'&&locationLat=' + longLat.lat + '&&locationLong=' + longLat.lng
        await fetch(url, getAPIObject)
            .then((response) => {
                return response.json()
            }).then((res) => {
                if (res&& res.data && res.data.businesses) {
                    console.log(res.data)
                    setBusinesses(res.data.businesses)
                    setShowTabel(true)
                }
                else throw ('no businesses data array found')
            }).catch((exception) => {
                console.log(exception);
            });
    }
    const clearForm = () => { 
        setShowCard(false)
        setShowTabel(false)
        setBusinesses([])
        setAutoDetectLocation(false)
        setkeyWord({})
        setkeyWordInput('')
        setOpenAC(false)
        setKeyWordOptions([])
        setCategory('all')
        setDistance()
        setLocation('')
        setLongLat({lat:'',lng:''})
        setAutoDetectLocation(false)
        setCardDetails({})
    }

    const onRowClick = async(id)=>{
        console.log(id)
        let url = proxy+'getBusinessDets?id=' + id;
        await fetch(url, getAPIObject)
            .then((response) => {
                console.log(response);
                return response.json()
            }).then((data) => {
                console.log(data);
                if (data) {
                    setCardDetails(data.data)
                    setShowTabel(false)
                    setShowCard(true)
                }
                else throw ('no businesses details found')
            }).catch((exception) => {
                console.log(exception);
            });
            let url2 = proxy+'getBusinessReviews?id=' + id;
            await fetch(url2, getAPIObject)
                .then((response) => {
                    console.log(response);
                    return response.json()
                }).then((data) => {
                    console.log(data);
                    if (data&& data.data&&data.data.reviews) {
                        setReviews(data.data.reviews)
                    }
                    else throw ('no businesses details found')
                }).catch((exception) => {
                    console.log(exception);
                });
    }

    const backBtnClick =()=>{
        setShowCard(false)
        setShowTabel(true)
    }
    return (<div className='col-12'>
        <div className='search-page container-1 row'>
        <Header nav='search' />
            <div className='search-form-cnt col-md-10'>
                <div className='form'>
                    <p className='form-title'>Business search</p>
                    <div className='search-form'>
                        <div className='row dist-cat-row'>
                            <div className="col-12">
                                <label className=''>Keyword <span className='req'>*</span></label>
                                <Autocomplete
                                    disablePortal
                                    getOptionLabel={(option) => option.label}
                                    id='auto-complete-keyword'
                                    options={keyWordOptions}
                                    filterOptions={(x) => x}
                                    autoComplete
                                    open={openAC}
                                    filterSelectedOptions
                                    value={keyWord}
                                    name='keyWordAutoCmp'
                                    renderInput={(params) => <TextField {...params} className='key-word' name='keyWord' label='' />}
                                    onChange={(e, seletedValue) => { formChange(e, "keyWordAutoComplete", seletedValue) }}
                                    onInputChange={(e, enteredVal) => formChange(e, 'autoCompInput', enteredVal)}
                                    onBlur={closeAutoComplete}
                                />
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-12'>
                                <div className='row dist-cat-row'>
                                    <div className='colmn  col-md-6'>
                                        <label>Distance</label>
                                        <TextField placeholder='10'
                                            value={distance}
                                            id='distance'
                                            type="number"
                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                            className='dist'
                                            onChange={(e, val) => formChange(e, 'distance', val)} />
                                    </div>
                                    <div className='colmn col-md-6'>
                                        <label className=''>Category <span className='req'>*</span></label>
                                        <Select
                                            className='category-select'
                                            value={category}
                                            onChange={(e, val) => formChange(e, 'category', val)}>
                                            <MenuItem value={'all'}>Default</MenuItem>
                                            <MenuItem value={'art-entertainment'}>Arts & Entertainment</MenuItem>
                                            <MenuItem value={'health'}>Health & Medical</MenuItem>
                                            <MenuItem value={'hotelstravel'}>Hotels & Travel</MenuItem>
                                            <MenuItem value={'food'}>Food</MenuItem>
                                            <MenuItem value={'professional'}>Professional Services</MenuItem>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className=' colmn col-12'>
                            <div className='colmn loc-inp'><label className=''>Location <span className='req'>*</span></label>
                                <TextField
                                    value={location}
                                    id='location'
                                    onChange={(e, val) => { formChange(e, 'location', val) }}
                                    disabled={autoDetectLocation}
                                    onBlur={getLocation}
                                ></TextField>
                            </div>
                            <div className='row-align'> <Checkbox value={autoDetectLocation} onChange={(e, val) => { formChange(e, 'checkbox', val) }} /><label>Auto-detect my location</label></div>
                        </div>

                        <div className='center-btns'>
                            <Button variant="danger" className='form-btn' onClick={submitForm} >
                                Submit
                            </Button>
                            <Button variant="primary" className='form-btn' onClick={clearForm}>
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        
        {showTabel&& <BusinessTabel businesses={businesses} onRowClick={onRowClick}/>}
        {showCard && <BusinessCard cardDetails ={cardDetails} reviews= {reviews} onBackClick={backBtnClick}/>}
        </div>
    </div>)
}
export default Search
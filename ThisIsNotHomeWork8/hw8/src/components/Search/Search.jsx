import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Header from '../Header/Header';
import './search.css';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Checkbox, MenuItem, Select } from '@mui/material';


function Search(props) {
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
                }
                else throw ('no businesses data array found')
            }).catch((exception) => {
                console.log(exception);
            });
    }
    const clearForm = () => { }

    return (<div className='col-12'>
        <Header nav='search' />
        <div className='search-form-cnt row'>
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
        </div>
    </div>)
}
export default Search
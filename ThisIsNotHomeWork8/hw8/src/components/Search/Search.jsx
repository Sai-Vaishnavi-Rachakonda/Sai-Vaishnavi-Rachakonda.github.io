import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Header from '../Header/Header';
import './search.css';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Checkbox, MenuItem, Select } from '@mui/material';


function Search(props) {
    const [keyWord, setkeyWord] = useState();
    const [keyWordInput, setkeyWordInput] = useState();
    const [openAC, setOpenAC] = useState(false);
    const [keyWordOptions, setKeyWordOptions] = useState([
        { code: 'AD', label: 'Andorra', phone: '376' },
        {
            code: 'AE',
            label: 'United Arab Emirates',
            phone: '971',
        }]);
    const [category, setCategory] = useState();
    const [distance, setDistance] = useState();
    const [location, setLocation] = useState();
    const [autoDetectLocation, setAutoDetectLocation] = useState();

    useEffect(() => {
        console.log(keyWord, keyWordInput,
            openAC, category, distance, location, autoDetectLocation)
    }, [keyWord, keyWordInput, openAC, category, distance, location, autoDetectLocation])

    const formChange = (e, name, value) => {
        console.log(name, value, e)
        switch (name) {
            case 'autoCompInput':
                {
                    setkeyWordInput(value);
                    if (value.length > 3) {
                        setOpenAC(true)
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
                    setLocation('')
                    break
                }
            default:
                console.log(name, value, e)
        }
    }

    const closeAutoComplete = () => {
        if (openAC) {
            setOpenAC(false)
        }
    }

    const submitForm = () => { }
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
                                disabled={autoDetectLocation}></TextField>
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
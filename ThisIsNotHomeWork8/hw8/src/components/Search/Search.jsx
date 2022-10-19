import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Header from '../Header/Header';
import './search.css';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


function Search(props) {
    const [keyWordInput, setKeyWordInput] = useState('');
    const [keyWordOptions, setKeyWordOptions] = useState([
        { code: 'AD', label: 'Andorra', phone: '376' },
        {
          code: 'AE',
          label: 'United Arab Emirates',
          phone: '971',
        }]);
    const formChange = (e) => {
        const { name, value,key } = e.target;
        switch (name) {
            case 'keyWordInput':
                setKeyWordInput(value);
                break;
            case 'keyWordAutoCmp':
                console.log(name,key)
            default:
                console.log(name,value,key,e)
        }
    }

    return (<>
        <Header nav='search' />
        <div className='search-form-cnt'>
            <div className='form'>
                <p className='form-title'>Business Search</p>
                <Form className='search-form'>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Keyword *</Form.Label>
                        <Autocomplete
                            disablePortal
                            getOptionLabel={(option) => option.label}
                            id='auto-complete-keyword'
                            options={keyWordOptions}
                            open={keyWordInput.length > 3}
                            name='keyWordAutoCmp'
                            sx={{ width: 625 }}
                            renderInput={(params) => <TextField {...params} onChange={formChange} className='key-word' name='keyWordInput' label='' />}
                            onChange={(e)=>formChange(e)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPasswßord">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Check me out" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        </div>
    </>)
}
export default Search
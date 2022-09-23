$(document).ready(function () {
    // initalize all variables
    const defaultForm = {
        keyWord: '',
        distance: 10,
        category: 'all',
        location: '',
        getLocation: 'off',
        cords: { lat: 0, long: 0 }
    }
    const keyWord = $('#keyWord')
    const distance = $('#distance')
    const category = $('#category')
    const location = $('#location')
    const getLocation = $('#get-location')
    const submit = $('#submit')
    const clear = $('#clear')
    const tableWrapper = $('#result-table-wrapper')
    const cardWrapper = $('#details-card-wrapper')
    let form = { ...defaultForm };
    let getAPIObject = {
        method: 'GET',
        header: {
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    };
    let businesses = []


    //onChange functions
    $('input').on('change', (e) => onChange(e.target.id, e.target.value));
    $('select').on('change', (e) => onChange(e.target.id, e.target.value));
    const onChange = async (id, value) => {
        form[id] = value;
        if (id === 'get-location' && getLocation['0'].checked) {
            const locURL = 'https://ipinfo.io?token=d86e1ea0fedc63'
            await fetch(locURL, getAPIObject)
                .then(res => {
                    if (res && res.status === 200)
                        return res.json()
                    else throw ('There was an error fetching long and lat')
                }
                ).then(data => {
                    const { loc } = data
                    form.cords = {
                        lat: parseFloat(loc.split(',')[0]),
                        long: parseFloat(loc.split(',')[1])
                    }
                })
                .catch(e => console.log(e))
            form['location'] = '';
            form['get-location'] = true
            location.val('');
            location['0'].disabled = true;
        }
        if (id === 'get-location' && !getLocation['0'].checked) {
            getLocation.prop('checked', false);
            form['get-location'] = false;
            location.val('');
            location['0'].disabled = false;
        }
        if (id === 'location' && location.value != '') {
            const apiKey = 'AIzaSyDGDvD0izXPSz_65z-iZyznuyDlU-D0Qz0'
            const addressURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value + '&key=' + apiKey
            await fetch(addressURL, getAPIObject)
                .then(res => {
                    if (res && res.status === 200)
                        return res.json()
                    else throw ('There was an error fetching long and lat')
                }
                ).then(data => {
                    form.cords = {
                        lat: data.results[0].geometry.location.lat,
                        long: data.results[0].geometry.location.lng
                    }
                })
                .catch(e => console.log(e))
        }
        console.log(form)
    }


    //onClear
    clear.on('click', () => {
        form = { ...defaultForm };
        tableWrapper.empty();
        cardWrapper.empty();
        keyWord.val('');
        distance.val('');
        category.val('all');
        location.val('');
        getLocation.prop('checked', false);
        businesses=[]
    })

    //validate the form 
    const validate = () => {
        //TODO: validate the form and display tooltips
        //convert miles to meters
        return true
    }
    // onSubmit
    const onSubmit = async () => {
        //first empty the exsisting table,card content
        tableWrapper.empty();
        cardWrapper.empty();
        //make api call
        let url = 'http://127.0.0.1:5000/getDets?keyWord=' + form.keyWord +
            '&&distance=' + (parseInt(form.distance * 1609.344)) + '&&category=' + form.category +
            '&&locationLat=' + form.cords.lat + '&&locationLong=' + form.cords.long
        await fetch(url, getAPIObject)
            .then((response) => {
                console.log(response);
                return response.json()
            }).then((data) => {
                console.log(data);
                if (data && data.businesses) {
                    constructTable(data.businesses);
                    businesses=[...data.businesses]
                }
                else throw ('no businesses data array found')
            }).catch((exception) => {
                console.log(exception);
            });
    };
    submit.on('click', () => onSubmit());

    //create the table with response from search api call
    const constructTable = (businesses) => {
        let tableHead = `        
        <table class="table-container">
        <thead class="table-head blue">
            <tr class="table-header-row">
                <td class="item-no">No.</td>
                <td class="item-rating">Image</td>
                <td class="item-name" id='business-name'>Business Name</td>
                <td class="item-rating" id='business-rating'>Rating</td>
                <td class="item-rating" id='business-distance'>Distance(miles)</td>
            </tr>
        </thead>
        <tbody>`
        let tableClose = ``
        let tableBody = ``
        if (businesses.length > 0) {
            for (let i = 0; i < businesses.length; i++) {
                let data = businesses[i]
                let row =
                    (`<tr>
            <td class="item-no"><span>${i + 1}</span></td>
            <td><img class='item-image'
                    src=${data.image_url}
                    alt=${data.alias}></td>
            <td class="item-name" id=${data.id} onclick='onNameClick'><span>${data.name}</span></td>
            <td class="item-rating"><span>${data.rating}</span></td>
            <td class="item-distance"><span>${(data.distance * 0.000621371192).toFixed(2)}</span></td>
            </tr>
        `)
                tableBody += row
            }
        }
        else {
            tableBody = `<tr><td></td><td></td><td>No Data Found</td><td></td><td></td></tr>`
        }
        let tblHTML = tableHead + tableBody + tableClose;
        tableWrapper.append(tblHTML);
    }

    //on click of business name
    const onNameClick = (e)=>{
        console.log(e)
    }
});
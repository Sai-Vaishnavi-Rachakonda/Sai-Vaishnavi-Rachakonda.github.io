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
        businesses = []
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
                return response.json()
            }).then((data) => {
                if (data && data.businesses) {
                    constructTable(data.businesses);
                    businesses = [...data.businesses]
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
            <td class="item-name"><span id=${data.id}>${data.name}</span></td>
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

    tableWrapper.on('click', (e) => {
        const { id } = e.target;
        console.log(e, id);
        if (id === 'business-name' || id === 'business-rating' || id === 'business-distance') {
            sortTable(id)
        }
        else if (id.length > 0) {
            buildCard(id)
        }
        else {
            console.log('clicked on', e)
        }
    })

    //Build the Card
    const getConcat = (value,seprator) => {
        let str =''
        for (i in value){
            str += value[i]?(value[i].title?value[i].title:value[i])+ seprator :''
        }
        return str.slice(0,str.length-3)
    }
    const constructCard = (data) => {
        let { is_closed, location, transactions, categories,
            display_phone, price, url,name,photos
        } = data;
        transactions= transactions.map(i=>{if(i==='restaurant_reservation') i='restaurant Reservation'; return (i[0].toUpperCase()+i.slice(1,i.length))})
        let status = is_closed ? 'Closed' : 'Open Now';
        let address = getConcat(location.display_address,'   ');
        let transactionSupported = getConcat(transactions,',  ');
        let category = getConcat(categories,' | ');
        let phone = display_phone
        console.log(status,address,transactionSupported,category);
        let cardHeader=(`<div class="card-conatiner">
                            <div class="card-header">
                                <p class="c-heading">${name}</p>
                                <div class="card-header-line"></div>
                            </div> `);
        let cardBody =(`
                        <div class="card-body">
                        ${status&&(`<div class="card-block">
                            <span class="block-header">Status</span>
                            <div class="block-content">
                                <span class=${is_closed ? "status-red":"status-green"}>${status}</span>
                            </div>
                        </div>`)}
                        ${category&&(`<div class="card-block">
                        <span class="block-header">Category</span>
                        <div class="block-content">
                            <span class="card-details">${category}</span>
                        </div>
                    </div>`)}
                    ${address&&(`<div class="card-block">
                        <span class="block-header">Address</span>
                        <div class="block-content">
                            <span class="card-details">${address}</span>
                        </div>
                    </div>`)}
                    ${phone&&(`<div class="card-block">
                        <span class="block-header">Phone No</span>
                        <div class="block-content">
                            <span class="card-details">${phone}</span>
                        </div>
                    </div>`)}
                    ${transactionSupported&&(`<div class="card-block">
                        <span class="block-header">Transactions Supported</span>
                        <div class="block-content">
                            <span class="card-details">${transactionSupported}</span>
                        </div>
                    </div>`)}
                    ${price&&(`<div class="card-block">
                        <span class="block-header">Price</span>
                        <div class="block-content">
                            <span class="card-details">${price}</span>
                        </div>
                    </div>`)}
                    ${url&&(`<div class="card-block">
                        <span class="block-header">More Info</span>
                        <div class="block-content">
                            <a href=${url} target="blank">Yelp</a>
                        </div>
                    </div>`)}
                    </div>
        `)
    cardImages =(`   
                    <div class="card-photos">
                    ${photos[0]&&`<div class="image-container">
                        <img src=${photos[0]} alt ="image" class="card-img">
                        <p class='photo-title'>Photo 1</p>
                    </div>`}
                    ${photos[1]&&`<div class="image-container">
                        <img src=${photos[1]} alt ="image" class="card-img">
                        <p class='photo-title'>Photo 2</p>
                    </div>`}
                    ${photos[2]&&`<div class="image-container">
                        <img src=${photos[2]} alt ="image" class="card-img">
                        <p class='photo-title'>Photo 3</p>
                    </div>`}
                </div>
                </div>`)
    let card = cardHeader+cardBody+cardImages;
    cardWrapper.append(card)
    }
    const buildCard = async (id) => {
        cardWrapper.empty()
        let url = 'http://127.0.0.1:5000/getBusinessDets?id=' + id;
        await fetch(url, getAPIObject)
            .then((response) => {
                console.log(response);
                return response.json()
            }).then((data) => {
                console.log(data);
                if (data) {
                    constructCard(data);
                }
                else throw ('no businesses data array found')
            }).catch((exception) => {
                console.log(exception);
            });
    }
});
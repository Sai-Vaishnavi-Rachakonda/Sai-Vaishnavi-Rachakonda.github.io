$(document).ready(function () {
    // initalize All variables
    const defaultForm = {
        keyWord: '',
        distance: 0,
        category: 'All',
        location: '',
        getLocation: 'off',
        cords: { lat: '', long: '' }
    }
    const keyWord = $('#keyWord')
    const distance = $('#distance');
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
    let businesses = [];
    let sort = {
        colName: '',
        order: false //dec
    };
    let isWaiting= false
    const host = 'https://thisisnothw6.ew.r.appspot.com/'

    //onChange functions
    $('input').on('change', (e) => onChange(e.target.id, e.target.value));
    $('select').on('change', (e) => onChange(e.target.id, e.target.value));
    const onChange = async (id, value) => {
        form[id] = value;
        if (id === 'get-location' && getLocation['0'].checked) {
            submit.prop('disabled', true);
            isWaiting = true;
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
                .finally(()=>{submit.prop('disabled', false);
                isWaiting=false})
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
            form['cords']={long:'',lat:''}
        }
        if (id === 'location' && location.val() != ''&&location.val().length>0) {
            submit.prop('disabled', true);
            isWaiting= true;
            const apiKey = 'AIzaSyDGDvD0izXPSz_65z-iZyznuyDlU-D0Qz0'
            const addressURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value + '&key=' + apiKey
            await fetch(addressURL, getAPIObject)
                .then(res => {
                    if (res && res.status === 200)
                        return res.json()
                    else throw ('There was an error fetching long and lat')
                }
                ).then(data => {
                    if (data && data.results && data.results.length > 0) {
                        form.cords = {
                            lat: data.results[0].geometry.location.lat,
                            long: data.results[0].geometry.location.lng
                        }
                    }
                    else {
                        console.log('Coordinates for the given Location Not found');
                        form.cords = {
                            lat: '',
                            long: ''
                        }
                    }
                })
                .catch(e => console.log(e))
                .finally(()=>{submit.prop('disabled', false); isWaiting=false;})
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
        category.val('All');
        location.val('');
        location['0'].disabled = false;
        getLocation.prop('checked', false);
        businesses = [];
        sort = {
            colName: '',
            order: false //dec
        };
    })

    //validate the form 
    const validate = () => {
        isValid = true;
        if (form.keyWord.length<=0||form.category.length<=0||form.cords.lat =='') {
            isValid = false
        }
        return isValid
    }
    // onSubmit
    const onSubmit = async (e) => {
        //first empty the exsisting table,card content
        //
        setTimeout(()=>{},10000)
        if (validate()) {
            e.preventDefault()
            tableWrapper.empty();
            cardWrapper.empty();
            //make api call
            let url = host+'getDets?keyWord=' + form.keyWord +
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
        }
        else if(!validate()&& location.val()!==''){
            e.preventDefault();
            alert('Entered Location is Invalid')
        }
        //if form validit y fails
        return false
    };
    submit.on('click', (e) => onSubmit(e));

    //create the table with response from search api call
    const constructTable = (businesses) => {
        let tableHead = `        
        <table class="table-container">
        <thead class="table-head blue-head">
            <tr class="table-header-row">
                <td class="item-no">No.</td>
                <td class="item-rating">Image</td>
                <td class="item-name" id='name'>Business Name</td>
                <td class="item-rating pointer" id='rating'>Rating</td>
                <td class="item-rating pointer" id='distance'>Distance(miles)</td>
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
                    src=${data.image_url.length > 0 ? data.image_url : ''}
                    alt=${data.name}></td>
            <td class="item-name gray" id=${data.id}><span id=${data.id}>${data.name}</span></td>
            <td class="item-rating"><span>${data.rating}</span></td>
            <td class="item-distance"><span>${(data.distance * 0.000621371192).toFixed(2)}</span></td>
            </tr>
        `)
                tableBody += row
            }
            let tblHTML = tableHead + tableBody + tableClose;
            tableWrapper.append(tblHTML);
        }
        else {
            let tblHTML = `<div class='no-data'>No Record has been found</div>`
            tableWrapper.append(tblHTML);
            businesses=[]
        }
        var offset = tableWrapper.offset();
        offset.left -= 20;
        offset.top -= 20;
        $('html, body').animate({
            scrollTop: offset.top,
            scrollLeft: offset.left
        });
    }

    tableWrapper.on('click', (e) => {
        const { id } = e.target;
        console.log(e, id);
        if (id === 'name' || id === 'rating' || id === 'distance') {
            sortTable(id)
        }
        else if (id.length > 0) {
            buildCard(id)
        }
        else {
            console.log('clicked on', e)
        }
    })

    const sortTable = (id) => {
        let data = [...businesses];
        tableWrapper.empty();
        sort.order = sort.colName === id ? !sort.order : true
        sort.colName = id
        if (sort.colName === 'name') {
            data =
                data.sort((a, b) => a[sort.colName].toUpperCase().localeCompare(b[sort.colName].toUpperCase(), "de", { sensitivity: "base" }));
            if (sort.order) {
                sortedData = data
            }
            else {
                data = data.reverse();
                sortedData = data
            }

        }
        {
            sortedData = data.sort((a, b) => {
                if (sort.order) return a[sort.colName] - b[sort.colName]
                return b[sort.colName] - a[sort.colName]
            });
        }
        constructTable(sortedData)
    }

    //Build the Card
    const getConcat = (value, seprator) => {
        let str = ''
        for (i in value) {
            str += value[i] ? (value[i].title ? value[i].title : value[i]) + seprator : ''
        }
        return str.slice(0, str.length - 3)
    }
    const constructCard = (data) => {
        let { hours, location, transactions, categories,
            display_phone, price, url, name, photos
        } = data;
        transactions = transactions.map(i => { if (i === 'restaurant_reservation') i = 'restaurant Reservation'; return (i[0].toUpperCase() + i.slice(1, i.length)) })
        let status = hours && [0] && ['is_open_now'];
        let address = getConcat(location.display_address, '   ');
        let transactionSupported = getConcat(transactions, ' | ');
        let category = getConcat(categories, ' | ');
        let phone = display_phone;
        price = price && price.length > 0 ? price : ''
        console.log(status, address, transactionSupported, category);
        let cardHeader = (`<div class="card-conatiner">
                            <div class="card-header">
                                <p class="c-heading">${name}</p>
                                <div class="card-header-line"></div>
                            </div> `);
        let cardBody = (`
                        <div class="card-body">
                        ${(`<div class="card-block">
                            <span class="block-header">Status</span>
                            <div class="block-content">
                                <span class=${status ? "status-green" : "status-red"}>${status ? "Open Now" : "Closed"}</span>
                            </div>
                        </div>`)}
                        ${category && (`<div class="card-block">
                        <span class="block-header">Category</span>
                        <div class="block-content">
                            <span class="card-details">${category}</span>
                        </div>
                    </div>`)}
                    ${address && (`<div class="card-block">
                        <span class="block-header">Address</span>
                        <div class="block-content">
                            <span class="card-details">${address}</span>
                        </div>
                    </div>`)}
                    ${phone && (`<div class="card-block">
                        <span class="block-header">Phone No</span>
                        <div class="block-content">
                            <span class="card-details">${phone}</span>
                        </div>
                    </div>`)}
                    ${transactionSupported && (`<div class="card-block">
                        <span class="block-header">Transactions Supported</span>
                        <div class="block-content">
                            <span class="card-details">${transactionSupported}</span>
                        </div>
                    </div>`)}
                    ${price && (`<div class="card-block">
                        <span class="block-header">Price</span>
                        <div class="block-content">
                            <span class="card-details">${price}</span>
                        </div>
                    </div>`)}
                    ${url && (`<div class="card-block">
                        <span class="block-header">More Info</span>
                        <div class="block-content">
                            <a href=${url} target="blank">Yelp</a>
                        </div>
                    </div>`)}
                    </div>
        `)
        cardImages = photos.length > 0 ? (`   
                    <div class="card-photos">
                    ${photos[0] && photos[0] !== undefined ?`<div class="image-container">
                    <div class="img-hldr"><img src=${photos[0]} alt ="image" class="card-img"></div>
                    <p class='photo-title'>Photo 1</p>
                </div>`:(`<div></div>`)}
                ${photos[1] && photos[1] !== undefined ? `<div class="image-container">
                <div class="img-hldr"><img src=${photos[1]} alt ="image" class="card-img"></div>
                    <p class='photo-title'>Photo 2</p>
                </div>`:(`<div></div>`)}
                ${photos[2] && photos[2] !== undefined ? `<div class="image-container">
                <div class="img-hldr"><img src=${photos[2]} alt ="image" class="card-img"></div>
                    <p class='photo-title'>Photo 3</p>
                </div>`:(`<div></div>`)}
                </div>
                </div>`) : (`<div></div>`)
        let card = cardHeader + cardBody + cardImages;
        cardWrapper.append(card);
        var offset = cardWrapper.offset();
        offset.left -= 20;
        offset.top -= 20;
        $('html, body').animate({
            scrollTop: offset.top,
            scrollLeft: offset.left
        });
    }
    const buildCard = async (id) => {
        cardWrapper.empty()
        let url = host+'/getBusinessDets?id=' + id;
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
const mongoose = require('mongoose');
const Business = require('../models/business');


mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })


const business = [{
        name: 'Intermission',
        country: 'Spain',
        city: 'Barcelona'
        streetName: 'Passeig de Gracia'
        streetNumber: 40,
        postCode: 08007,
        imageUrl: '/images/images-bdd-simulation/001.r-jpg',
        phone: 223005522,
        webpage: 'www.intermission-resto.es',
        type: 'Restaurant',
        about: 'Small and modern restaurant for sharing and trying new things.'
    }, {
        name: 'Coffee House',
        country: 'Spain',
        city: 'Barcelona'
        streetName: 'Carrer de Bonavista'
        streetNumber: 10,
        postCode: 08037,
        imageUrl: '/images/images-bdd-simulation/002.r-jpg',
        phone: 568998561 ,
        webpage: 'www.tch.es',
        type: 'Restaurant',
        about: 'Merge between the best of the food and the coffee world.'
    }, {
        name: 'C-4',
        country: 'Spain',
        city: 'Barcelona'
        streetName: 'Carrer de Francisco de Giner'
        streetNumber: 22,
        postCode: 08012,
        imageUrl: '/images/images-bdd-simulation/003.r-jpg',
        phone: 669999556,
        webpage: 'www.c4-restaurant-es',
        type: 'Restaurant',
        about: 'A restaurant from and for fish lovers.'
    }, {
        name: 'La vinya nostra',
        country: 'Spain',
        city: 'Barcelona'
        streetName: 'Carrer de Bonavista'
        streetNumber: 17,
        postCode: 08012,
        imageUrl: '/images/images-bdd-simulation/004.r-jpg',
        phone: 978552103,
        webpage: 'www.vinyanostra.cat',
        type: 'Restaurant',
        about: 'Small bodega managed by a family.'
    }, {
        name: 'Modernbia',
        country: 'Spain',
        city: ''
        streetName: ''
        streetNumber: ,
        postCode: ,
        imageUrl: '/images/images-bdd-simulation/005.r-jpg',
        phone: ,
        webpage: 'www.intermission-resto.es',
        type: 'Restaurant',
        about: 'Small and modern restaurant for sharing and trying new things.'
    }, {
        name: '',
        country: '',
        city: ''
        streetName: ''
        streetNumber: ,
        postCode: ,
        imageUrl: '/images/images-bdd-simulation/002.r-jpg',
        phone: ,
        webpage: 'www.intermission-resto.es',
        type: 'Restaurant',
        about: 'Small and modern restaurant for sharing and trying new things.'
    }, {
        name: '',
        country: '',
        city: ''
        streetName: ''
        streetNumber: ,
        postCode: ,
        imageUrl: '/images/images-bdd-simulation/002.r-jpg',
        phone: ,
        webpage: 'www.intermission-resto.es',
        type: 'Restaurant',
        about: 'Small and modern restaurant for sharing and trying new things.'
    },

];


Business.create(business, (err) => {
    if (err) {
        throw (err)
    }
    console.log(`Created ${business.length} movies`)
    mongoose.connection.close();
});

// 11 restaurant
// 8 coffee shops
// 1 shoe store
// 3  hairdress
//  5 clothing
// 5 bookstore
// 3 toy store
// 4 fruits and vegetables
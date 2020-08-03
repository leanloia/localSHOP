const business = [{
        name: 'Frooty',
        adress: 'Av Diagonal, 601',
        city: 'Barcelona',
        imageUrl: '',
        phone: '93 798 54 50',
        webpage: 'http://www.frootybcn.cat',
        type: 'Fruits and Vegetables',
        about: 'Frooty collaborates with farmers and cooperatives in Catalonia who supply us with their best products every day of the year.',
    },

];



Business.create(business, (err) => {
    if (err) {
        throw (err)
    }
    console.log(`Created ${business.length} movies`)
    mongoose.connection.close();
});
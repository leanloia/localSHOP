//función auxiliar para quitar ciudades repetidas y poner la primera en mayus (routes/business)
function uniquifyCities(array) {
    var cities = [];
    if (array.length === 0) {
        return undefined;
    }
    for (var i = 0; i < array.length; i++) {
        var cityUpper= array[i].city.charAt(0).toUpperCase() + array[i].city.slice(1);
        if (cities.indexOf(cityUpper) === -1) {
            cities.push(cityUpper);
        }
    }
    return cities;
}
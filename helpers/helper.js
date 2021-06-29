
// function autoroute() {
//     location.assign("http://localhost:5000/dashboard")
// }
// module.exports = autoroute;

getFlag = function(country) {
    var flag_img_name = "";
    if (country.toLowerCase() == "us") {
        flag_img_name = "flag_us16x13.gif";
    }   
    else if (country.toLowerCase() == "ca"){
        flag_img_name = "flag_ca16x13.gif";
    }
    return flag_img_name; 
    }
    anotherFunction=function(){
    return  location.assign("http://localhost:5000/dashboard")
    }
    
       module.exports={getFlag, anotherFunction}
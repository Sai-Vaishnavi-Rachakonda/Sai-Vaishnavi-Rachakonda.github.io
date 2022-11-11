import { Loader } from '@googlemaps/js-api-loader';

function Map (props){
    const apiKey = "AIzaSyDWwSl6QStmBq1A0Bx8WbOD-TY3ml9imBc"

const loader = new Loader({
  apiKey: apiKey,
  version: "weekly",
  libraries: ["places"]
});

const mapOptions = {
  center: props.position,
  zoom: 17
};

loader
  .load()
  .then((google) => {
   let map = new google.maps.Map(document.getElementById("map"), mapOptions);
    new google.maps.Marker({
        position: props.position,
        map: map,
      });
  })
  .catch(e => {
    // do something
  });
  return(
      <div  className='btn-row'>
  <div id='map' className='map-cont'></div>
  </div>
  )
}
export default Map
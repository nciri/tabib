import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const DoctorMap = ({ address, city }) => {
  const mapStyles = {
    height: "300px",
    width: "100%",
    borderRadius: "8px"
  };

  const defaultCenter = {
    lat: 43.3047, // Marseille coordinates as default
    lng: 5.3927
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={15}
        center={defaultCenter}
      >
        <Marker position={defaultCenter} />
      </GoogleMap>
    </LoadScript>
  );
};

export default DoctorMap; 
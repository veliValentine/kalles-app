class LocationError extends Error {
	constructor(message) {
		super(message);
		this.name = "LocationError";
	}
}

export default LocationError;

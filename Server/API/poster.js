const baseURL = "https://image.tmdb.org/t/p/";
const size = "w500"; // You can change this to w200, w780, original, etc.
const posterPath = "/lWh5OlerPR1c1cfn1ZLq0lpqFds.jpg";

const fullPosterURL = `${baseURL}${size}${posterPath}`;
console.log(fullPosterURL);
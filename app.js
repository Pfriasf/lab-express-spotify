require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const  SpotifyWebApi  =  require('spotify-web-api-node') ;

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );
// Our routes go here:

app.get('/',(req,res,next) =>{
    res.render('index')
})

app.get("/artist-search", (req, res, next) => {
  let artist = req.query.artist
   console.log(artist)

   spotifyApi
     .searchArtists(artist)
     .then((data) => {
       console.log("The received data from the API: ", data.body.artists.items);
       res.render("artist-search-results",{ artists:data.body.artists.items });
     })
     .catch((err) =>
       console.log("The error while searching artists occurred: ", err)
     );
});

app.get("/albums/:id", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      res.render("albums", { albums: data.body.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    ); 
})

app.get("/tracks/:id", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.id)
    .then((data) => {
      console.log("The received data from the API: ", data.body.items[0].available_markets);
      res.render("tracks", { tracks: data.body.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    ); 
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

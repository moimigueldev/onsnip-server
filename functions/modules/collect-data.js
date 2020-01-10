const rp = require('request-promise');
const keys = require('../secret-keys/enviorment-variables')
const filterData = require('./filter-data');


const artistFollowing = async (token) => {
  const options = {
    'method': 'GET',
    'url': 'https://api.spotify.com/v1/me/following?type=artist&limit=50',
    'headers': {
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': keys.cors['spotify-header']
    }
  };

  return rp(options).then(response => JSON.parse(response).artists.items)
  // .catch(err => console.log('Error with geting users artist following', err))
}

const playlist = async (id, token) => {

  const options = {
    'method': 'GET',
    'url': `https://api.spotify.com/v1/users/${id}/playlists?limit=50`,
    'headers': {
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': keys.cors['spotify-header']
    }
  };

  return rp(options).then(response => JSON.parse(response).items)
  // .catch(err => console.log('Error with getting the user\'s Playlist', err))

}

let tracksList = [];

const savedtracks = async (offset, token) => {
  // console.log('looping', offset)

  let tracks = await getUsersSavedTracks(offset, token)
  tracks = JSON.parse(tracks)

  tracks.items.length ? tracksList.push(...tracks.items) : null;

  if (offset !== tracks.total) {
    offset = tracks.total - offset >= 50 ? offset + 50 : (tracks.total - offset) + offset
    return savedtracks(offset, token)
  }

  return tracksList
}


const getUsersSavedTracks = async (offset, token) => {
  const options = {
    'method': 'GET',
    'url': `https://api.spotify.com/v1/me/tracks?limit=50&offset=${offset}`,
    'headers': {
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': keys.cors['spotify-header']
    }
  };

  return rp(options)

}

const getTopTracks = async (token) => {
  const options = {
    'method': 'GET',
    'url': 'https://api.spotify.com/v1/me/top/tracks?limit=50',
    'headers': {
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': keys.cors['spotify-header']
    }
  };

  return rp(options).then(response => JSON.parse(response).items)
    .catch(err => err)
}

const getTopArtist = async (token) => {
  const options = {
    'method': 'GET',
    'url': 'https://api.spotify.com/v1/me/top/artists?limit=50',
    'headers': {
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': keys.cors['spotify-header']
    }
  };

  return rp(options).then(response => JSON.parse(response).items)
  // .catch(err => {
  //   console.log("err", err)
  // })
}

const genresList = []
const savedTracksOffset = 0;

const userData = async (user, token) => {


  const userArtistFollowing = await artistFollowing(token);
  getGenres(userArtistFollowing)
  const userTopArtist = await getTopArtist(token)
  getGenres(userTopArtist)
  const topGenres = filterData.mergeGenresList(genresList)


  const userPlaylist = await playlist(user.id, token);
  const userSavedTracks = await savedtracks(savedTracksOffset, token)
  const filteredTracks = filterData.userData(userSavedTracks)
  const userTopTracks = await getTopTracks(token)


  return {
    userArtistFollowing,
    userPlaylist,
    // userSavedTracks,
    filteredTracks,
    userTopTracks,
    userTopArtist,
    user,
    topGenres
  }
}



const getGenres = (list) => {
  for (const el of list) {
    genresList.push(...el.genres)
  }
}



module.exports = {
  artistFollowing,
  playlist, savedtracks,
  getTopTracks,
  getTopArtist,
  userData,
}
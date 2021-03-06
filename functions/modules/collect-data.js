const rp = require('request-promise');
const keys = require('../secret-keys/enviorment-variables')
const filterData = require('./filter-data');
const prettyMilliseconds = require('pretty-ms');


const artistFollowing = async (token) => {


    const options = {
        'method': 'GET',
        'url': 'https://api.spotify.com/v1/me/following?type=artist&limit=50',
        'headers': {
            'Authorization': `Bearer ${token}`,
            'Access-Control-Allow-Origin': keys.cors['spotify-header']
        }
    };

    // return rp(options).then(response => JSON.parse(response).artists.items)
    // .catch(err => console.log('Error with geting users artist following', err))

    return rp(options).then(response => {
        response = JSON.parse(response).artists.items
        return list = response.map(item => {
            return {
                name: item.name,
                followers: item.followers.total,
                image: item.images[item.images.length - 1].url,
                genres: item.genres
            }
        })

    }); // end of promise

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

    return rp(options).then(response => {
        let playlist = JSON.parse(response).items
        const plList = [];

        playlist.forEach((pl, index) => {


            if (pl.images.length) {
                plList.push({
                    name: pl.name,
                    total: pl.tracks.total,
                    image: pl.images[pl.images.length - 1].url
                })
            } else {
                plList.push({
                    name: pl.name,
                    total: pl.tracks.total,
                    image: 'https://www.wcifly.com/icons/nopicture.png'
                })
            }

        })

        return plList;
    })
    // return rp(options).then(response => JSON.parse(response).items)
    // .catch(err => console.log('Error with getting the user\'s Playlist', err))

}

let tracksList = [];
let totalTracks = 0;

const savedtracks = async (offset, token) => {
    console.log('looping', offset)

    let tracks = await getUsersSavedTracks(offset, token)
    tracks = JSON.parse(tracks)


    tracks.items.length ? tracksList.push(...tracks.items) : null;


    if (offset !== tracks.total) {
        offset = tracks.total - offset >= 50 ? offset + 50 : (tracks.total - offset) + offset
        return savedtracks(offset, token)
    }


    totalTracks = tracks.total;
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


    return rp(options).then(response => {
        response = JSON.parse(response).items

        return list = response.map(item => {
            return {
                name: item.name,
                image: item.album.images[item.album.images.length - 1].url,
                duration: formatSongDuration(item.duration_ms),
                album: item.album.name
            }

        })
    }).catch(err => err)
}

const formatSongDuration = (ms) => {
    const time = prettyMilliseconds(ms, { colonNotation: true })
    return time.substring(0, time.lastIndexOf('.'))
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

    return rp(options).then(response => {
        response = JSON.parse(response).items;
        const list = []

        response.forEach(item => {
            if (item.images.length > 2 && item.genres.length) {
                list.push({
                    name: item.name,
                    image: item.images[item.images.length - 1].url,
                    genres: item.genres
                })
            }
        })

        return list;
    })

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
        topGenres,
        totalTracks
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
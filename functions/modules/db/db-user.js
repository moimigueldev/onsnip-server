const admin = require('firebase-admin');



const db = admin.firestore();


const searchDBForUser = async (userLoggedIn, token) => {
    const profile = userLoggedIn
    const user = await db.collection('users').doc(profile.id).get();

    if (!user.data()) { //does not exist yet
        // console.log('creating new user');
        const newUser = {
            id: profile.id,
            dateUpdated: new Date(),
            displayName: profile.display_name,
            followers: profile.followers,
            token
        }


        return db.collection('users').doc(profile.id).set(newUser).then((user) => {
            return user.data();
        })
    } else {
        return user.data();
    }
}


const saveUserData = async (data, token) => {
    await db.doc(`users/${data.user.id}/${data.user.id}/analytics`).set({
        artistFollowing: data.userArtistFollowing,
        playlist: data.userPlaylist,
        topTracks: data.userTopTracks,
        topArtist: data.userTopArtist,
        topGenres: data.topGenres,

    });

    await db.doc(`users/${data.user.id}/${data.user.id}/filteredData`).set({
        tracksSavedThisMonth: data.filteredTracks.thisMonth,
        tracksSavedThisYear: data.filteredTracks.thisYear,
        tracksSavedlastYear: data.filteredTracks.lastYear,
        mostListenedArtist: data.filteredTracks.finalList
    })

    return db.collection('users').doc(data.user.id).update({
        dateUpdated: new Date(),
        token
    }).then(response => {
        return response
    })
        .catch(err => {
            return err
        })



}

const getSavedUserData = async (cookie) => {
    const id = cookie.id
    const filteredData = await db.doc(`users/${id}/${id}/filteredData`).get().then(response => {
        return response.data()
    })
        .catch(err => {
            return err
        })

    const analytics = await db.doc(`users/${id}/${id}/analytics`).get().then(response => {
        return response.data()
    })
        .catch(err => {
            return err
        })



    return { analytics, filteredData }




}


module.exports = {
    searchDBForUser,
    saveUserData,
    getSavedUserData
}
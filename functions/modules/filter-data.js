// const trackList = require('../tracks-small')
// const trackList = require('../tracks')
const moment = require('moment');
// const write = require('write');


const userData = (list) => {
    const date = moment().format().toString().split('-');
    const thisYear = [];
    const lastYear = [];
    const thisMonth = [];
    const artistsList = {}

    let thisYearCounter = 0;
    let thisMonthCounter = 0;
    let lastYearCounter = 0;




    list.forEach(el => {

        const createdAt = el.added_at.split('-');
        const artist = el.track.album.artists[0].name

        // // TRACKS ADDED THIS YEAR, MONTH, LAST YEAR
        // // tracks added this year
        // if (createdAt[0] === date[0]) thisYear.push(el);
        // // Tracks added last year
        // if (Number(createdAt[0]) === Number(date[0] - 1)) lastYear.push(el);
        // //Tracks Added This Month
        // if (createdAt[0] === date[0] && createdAt[1] === date[1]) thisMonth.push(el);
        // // ARTISTS LITENED TO

        // TRACKS ADDED THIS YEAR, MONTH, LAST YEAR
        // tracks added this year
        if (createdAt[0] === date[0]) thisYearCounter += 1;
        // Tracks added last year
        if (Number(createdAt[0]) === Number(date[0] - 1)) lastYearCounter += 1;
        //Tracks Added This Month
        if (createdAt[0] === date[0] && createdAt[1] === date[1]) thisMonthCounter += 1
        // ARTISTS LITENED TO


        if (artistsList[artist]) {
            artistsList[artist] += 1
        } else {
            artistsList[artist] = 1
        }
    }); //end of loop

    let artistSorted = Object.keys(artistsList).sort((a, b) => { return artistsList[a] - artistsList[b] }).reverse()




    // artistSorted = returnSortedArtistValues(artistSorted.reverse(), artistsList)
    // console.log('sorted', artistSorted)

    // console.log('data', thisMonthCounter, thisYearCounter, lastYearCounter)

    // const finalList = returnSortedArtistValues(artistSorted, artistsList)
    return { thisMonthCounter, thisYearCounter, lastYearCounter }
}

// this sniped gives the sorted list the object values back, might not be necessery
const returnSortedArtistValues = (list, original) => {
    const finalArtistList = {}
    const finalList = [];
    let other = 0;
    for (let el of list) {
        if (original[el] === 1) {
            other += 1
            break
        }
        finalArtistList[el] = original[el];


        finalList.push({ artist: el, total: original[el] })
    }

    finalList.push({ artist: 'other', total: other })
    return finalList;
}







const mergeGenresList = (list) => {


    const genres = [];
    const finalList = []
    const newList = ',' + list.join(',') + ','

    list.forEach((el) => {
        const regex = new RegExp(`,${el},`, 'g');
        if (!genres.includes(el)) {

            if (newList.match(regex) !== null) {
                finalList.push({ name: el, total: newList.match(regex).length })
                genres.push(el)
            }

        }
    });



    return finalList.sort((a, b) => b.total - a.total);


}


module.exports = { userData, mergeGenresList }


//WRITING
// await write('tracks.json', JSON.stringify(list), { overwrite: true });
const { closeConn } = require('./config/mongoConnection')
const restaurants = require('./data/restaurants')

async function main() {
    let honeysDelight, pandorasBox, ayoubsCafe
    try { // 1
        honeysDelight = await restaurants.create("Honey's Delight", "Mumbai, Maharashtra", "977-338-5898", "Http://www.honeysdelight.com", "$", ["Italian"], 5, {dineIn: false, takeOut: true, delivery: true});
        console.log(honeysDelight); // 2
    } catch (e) {
        console.log(e);        
    }
    try { // 3
        pandorasBox = await restaurants.create("Pandora's Box", "Mumbai, Maharashtra", "222-204-0880", "https://www.pandorasbox.com", "$$$", ["Italian", "Gourmet"], 4, {dineIn: true, takeOut: true, delivery: true})
    } catch (e) {
        console.log(e);
    }
    try { // 4
        let getAll = await restaurants.getAll() 
        console.log(getAll);
    } catch (e) {
        console.log();
    }
    try { // 5
        ayoubsCafe = await restaurants.create("Ayoub's Cafe", "Mumbai, Maharastra", "865-561-8535", "http://www.ayubs-cafe.com", "$$", ["Iranian", "Arabian", "Moroccan", "Lebanese"], 5, {dineIn: true, takeOut: true, delivery: false})
        console.log(ayoubsCafe); // 6
    } catch (e) {
        console.log(e);
    }
    try { // 7
        let renameWebsite = await restaurants.rename(honeysDelight._id, 'https://www.honeysdelightfoodtruck.com')
        console.log(renameWebsite); // 8
    } catch (e) {
        console.log(e);
    }
    try { // 9
        const removeRestaurant = await restaurants.remove(pandorasBox._id)
        console.log(removeRestaurant);
    } catch (e) {
        console.log(e);
    }
    try { // 10
        let allRestaurants = await restaurants.getAll()
        console.log(allRestaurants); 
    } catch (e) {
        console.log(e);
    }
    try { // 11
        let granville = await restaurants.create("Granville", "Mumbai, Maharashtra", "977-338-5898", "http://www..honeysdelight.com", "$", ["Italian"], 5, {dineIn: false, takeOut: true, delivery: true, fake: true});
        console.log(granville); 
    } catch (e) {
        console.log(e);        
    }
    try { // 12
        const removeRestaurant = await restaurants.remove(pandorasBox._id)
        let allRestaurants = await restaurants.getAll()
        console.log(allRestaurants);
    } catch (e) {
        console.log(e);        
    }
    try { // 13
        let renameWebsite = await restaurants.rename(pandorasBox._id, 'https://www.mypandorasbox.com')
        console.log(renameWebsite); 
    } catch (e) {
        console.log(e);
    }
    try { // 14
        let renameWebsite = await restaurants.rename(ayoubsCafe._id, 'https://www.ayub s.com')
        console.log(renameWebsite); 
    } catch (e) {
        console.log(e);
    }
    try { // 15
        const get = await restaurants.get(pandorasBox._id) 
        console.log(get);
    } catch (e) {
        console.log(e);
    }

    // console.log("Done! Connection Terminated");
    closeConn()
}


main();
const people = require('./people')
const stocks = require('./stocks')

async function main(){
    try{
        const getPersonById = await people.getPersonById("2fc19190-5649-4fb2-8abf-85867e9522d6");
         console.log (getPersonById);
    }catch(e){
        console.log (e);
    }
    try{
        const sameStreet = await people.sameStreet("SutherLand", "Point");
        //  console.log (sameStreet);
        console.dir(sameStreet, { depth: null });

    }catch(e){
        console.log (e);
    }
    try{
        const manipulateSsn = await people.manipulateSsn();
        console.log (manipulateSsn);
    }catch(e){
        console.log (e);
    }
    try{
        const sameBirthday = await people.sameBirthday(1.0, '25');
         console.log (sameBirthday);
    }catch(e){
        console.log (e);
    }
    try{
        const listShareholders = await stocks.listShareholders();
        // console.log (listShareholders);
       console.dir(listShareholders, { depth: null });
    }catch(e){
        console.log (e);
    }
    try{
        const topShareholder = await stocks.topShareholder('Nuveen Floating Rate Income Fund');
        // console.log (topShareholder);
         console.dir(topShareholder, { depth: null });
    }catch(e){
        console.log (e);
    }
    try{
        const listStocks = await stocks.listStocks("Ambur", "Marchiso");
        // console.log (listStocks);
         console.dir(listStocks, { depth: null });
    }catch(e){
        console.log (e);
    }
    try{
        const getStockById = await stocks.getStockById("f652f797-7ca0-4382-befb-2ab8be914ff0");
        // console.log (getStockById);
         console.dir(getStockById, { depth: null });
    }catch(e){
        console.log (e);
    }
}

//call main
main();
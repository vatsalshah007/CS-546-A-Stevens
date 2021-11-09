const md5 = require('md5');
const { default: axios } = require("axios");
const { marvel } = require('.');
const publickey = 'f1dacbc2170b534c292d600eba6d24ef';
const privatekey = '71c5e8b014df2a10d45231233e8d379618a42dc7';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';

const getBySearchTerm = async function getBySearchTerm(searchTerm){
    if(!searchTerm) throw {title: "Character Found", code: 404, message: "Search Term cannot be Null"};
    if(searchTerm.trim().length==0) throw {title: "Character Found", code: 404, message: "Search Term cannot be empty spaces"};
    const { data } = await axios.get(`${baseUrl}?nameStartsWith=${searchTerm}&ts=${ts}&apikey=${publickey}&hash=${hash}&limit=20`)
    if((data.data.results).length == 0) throw {title: "Character Found", code: 404, message: "Character Not Found"}
    return data.data.results
}

const getById = async function getById(id) {
    if(!id) throw {code: 404, message: "ID cannot be Null"}
    if(id.trim().length==0) throw {code: 404, message: "ID cannot be empty spaces"}
    const { data } = await axios.get(`${baseUrl}/${id}?ts=${ts}&apikey=${publickey}&hash=${hash}`)
    if (!data) throw {code: 404, message: "Character Not Found"}
    return data.data.results

}
module.exports = {
    getBySearchTerm,
    getById
}
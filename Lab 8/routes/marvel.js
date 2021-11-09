const express = require('express');
const router = express.Router();
const { marvel } = require('../data');

router.get('/', async (req, res) => {
    res.render('marvel/index',  { title: "Character Finder"});
});

router.get('/characters/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(400).render(`marvel/errors`, {code: 400, description: `ID cannot be NULL or Undefined`})
        return
    }
    if ((req.params.id).trim().length == 0) {
        res.status(400).render(`marvel/errors`, {code: 400, description: `ID cannot be empty spaces`})
        return
    }
    try {
        const characterById = await marvel.getById(req.params.id);
        let name = characterById[0].name
        res.render(`marvel/characterId`, {title: name, searchResult: characterById})
    } catch (e) {
        if (e.code) {
            res.status(e.code).render(`marvel/errors`, {code: e.code, description: e.message})
        } else {
            res.status(404).render(`marvel/errors`, {code:404, description: 'Character Not Found' });
        }
    }
});

router.post('/search', async (req, res) => {
    const formBody = req.body
    let { searchTerm } = formBody
    try {
        if (!searchTerm) {
            res.status(400).render(`marvel/errors`, {title: "Character Found", searchPage: true, code: 400, description: `Search Term cannot be Null`})
            return;
        }
        if (searchTerm.trim().length == 0) {
            res.status(400).render(`marvel/errors`, {title: "Character Found", searchPage: true, code: 400, description: `Search Term cannot be empty spaces`})
            return;
        }
        const getCharacterBySearchTerm = await marvel.getBySearchTerm(searchTerm);
        res.render(`marvel/search`, {title: "Character Found", searchResult: getCharacterBySearchTerm, searchTerm: searchTerm })
    } catch (e) {
        if (e.code) {
            res.status(e.code).render(`marvel/search`, {title: "Character Found", noResult: true, code: 404, message: "Character Not Found", searchTerm: searchTerm})
        } else {
            res.status(404).render(`marvel/errors`, {code:404, description: 'Character Not Found' });
        }    
    }
  });

module.exports = router;

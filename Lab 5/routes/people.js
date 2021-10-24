const express = require('express');
const router = express.Router();
const { people } = require('../data');

router.get('/:id', async (req, res) => {
    try {
      const getPeopleById = await people.getPersonById(req.params.id);
      res.json(getPeopleById);
    } catch (e) {
        if (e) {
            res.status(404).json({ message: e });
        } else {
            res.status(404).json({ message: 'there is no person with that ID' });
        }
    }
});

router.get('/', async (req, res) => {
    try {
      const peopleList = await people.getAll();
      res.json(peopleList);
    } catch (e) {
      res.status(500).send();
    }
  });

module.exports = router;

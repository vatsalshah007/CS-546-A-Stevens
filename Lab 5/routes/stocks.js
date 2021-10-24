const express = require('express');
const router = express.Router();
const { stocks } = require('../data');

router.get('/:id', async (req, res) => {
    try {
      const getStockById = await stocks.getStockById(req.params.id);
      res.json(getStockById);
    } catch (e) {
        if (e) {
            res.status(404).json({ message: e });
        } else {
            res.status(404).json({ message: 'there is no stock with that ID' });
        }
    }
});

router.get('/', async (req, res) => {
    try {
      const stockList = await stocks.getAll();
      res.json(stockList);
    } catch (e) {
      res.status(500).send();
    }
  });

module.exports = router;

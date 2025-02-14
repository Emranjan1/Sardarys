const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Product } = require('../models');

router.get('/', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'No search query provided' });
    }

    const products = await Product.findAll({
      where: {
        name: {
          [Op.like]: `%${query}%`
        }
      }
    });


    const similarProducts = await Product.findAll({
      where: {
        name: {
          [Op.like]: `%${query.substring(0, 3)}%`
        },
        id: {
          [Op.ne]: products.map(product => product.id) 
        }
      }
    });

    res.json({ products, similarProducts });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

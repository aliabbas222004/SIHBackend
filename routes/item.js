const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { upload } = require('../config/cloudinary');
router.get('/getItem/:id', async (req, res) => {
    const item = await Item.findById(req.params.id);
    if (!item) {
        return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
});

router.get('/getAllItems/:type', async (req, res) => {
    if (req.params.type === 'all') {

        const items = await Item.find();
        if (!items) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.json(items);
    } else {
        const items = await Item.find({ category: req.params.type });
        if (!items) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.json(items);
    }
});

router.post('/addItem', upload.array('images', 5), async (req, res) => {
    try {
        const { id, name, description, category, price, stock, dimensions } = req.body;

        const imageLinks = req.files.map(file => file.path);

        const newItem = new Item({
            id,
            name,
            description,
            category,
            price,
            stock,
            dimensions: JSON.parse(dimensions),
            images: imageLinks,
        });

        await newItem.save();
        res.status(201).json({ success: true, item: newItem });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add item' });
    }
});


router.get('/searchItem', async (req, res) => {
    const query = req.query.q;
    try {
        const items = await Item.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
                { id: { $regex: query, $options: 'i' } }
            ]
        });
        return res.status(200).json(items);
    } catch (err) {
        return res.status(500).json({error:"Server error"});
    }
});

module.exports = router;
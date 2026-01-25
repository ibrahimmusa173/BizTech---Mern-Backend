const Item = require('../models/Item');

const itemController = {
    getAllItems: async (req, res) => {
        try {
            const items = await Item.find();
            res.status(200).json(items);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getItemById: async (req, res) => {
        try {
            const item = await Item.findById(req.params.id);
            if (!item) return res.status(404).json({ message: "Item not found." });
            res.status(200).json(item);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    createItem: async (req, res) => {
        try {
            const newItem = await Item.create(req.body);
            res.status(201).json({ message: "Item added!", id: newItem._id });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    updateItem: async (req, res) => {
        try {
            const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!item) return res.status(404).json({ message: "Item not found." });
            res.status(200).json({ message: "Item updated successfully!" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    deleteItem: async (req, res) => {
        try {
            const item = await Item.findByIdAndDelete(req.params.id);
            if (!item) return res.status(404).json({ message: "Item not found." });
            res.status(200).json({ message: "Item deleted successfully!" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = itemController;
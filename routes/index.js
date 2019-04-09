const express = require('express');
const router = express.Router();

// home route redirect to /books route
router.get('/', (req, res) => {
    res.redirect('./books');
});

module.exports = router;
const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('Project Manager API - Visit /api-docs for documentation');
});

module.exports = router;

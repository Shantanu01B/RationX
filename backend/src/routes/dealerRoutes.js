const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.post('/update-stock',
    auth,
    role(['dealer']),
    async(req, res) => {
        // dealer stock update logic
    });
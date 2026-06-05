const express = require("express");
const router = express.Router();

const indexController = require("../controllers/indexController");

router.route("/").get(indexController.getAllMessages);

router.post("/messages/:id/delete", indexController.deleteMessage);

router.get("/new-message", indexController.newMessageGet);

router.post("/new-message", indexController.ensureLoggedIn, indexController.newMessagePost);

router.get("/upgrade-membership", indexController.membershipGet);

router.post("/upgrade-membership", indexController.membershipPost);

router.post("/log-out", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        res.redirect("/");
    });
});

module.exports = router;
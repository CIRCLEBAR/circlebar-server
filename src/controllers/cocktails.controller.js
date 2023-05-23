const db = require("../config/db");

function getCocktails(req, res) {
    db.query("SELECT * FROM cocktails", (err, results) => {
        if (err) {
            res.status(500).json({ msg: "Error getting cocktails" });
        } else {
            results.forEach((cocktail) => {
                cocktail.recipe = JSON.parse(cocktail.recipe);
            });
            res.json(results);
        }
    });
}

function newCocktail(req, res) {
    var { image } = req.files;
    var { data } = req.body;

    if (!image || !data) {
        return res
        .status(400)
        .json({ msg: "Please enter image and data" });
    }

    var imagePath = '/cocktails/' + image.name;
    image.mv('./public' + imagePath, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Image uploaded");

            var jsonData = JSON.parse(data);
            var { name, recipe } = jsonData;
            if (!name || !recipe) {
                return res
                .status(400)
                .json({ msg: "Please enter a name and recipe" });
            }
            db.query(
                "INSERT INTO cocktails (name, image, recipe) VALUES (?, ?, ?)",
                [name, imagePath, JSON.stringify(recipe)],
                (err) => {
                    if (err) {
                        res.status(500).json({ msg: "Error adding cocktail" });
                    } else {
                        res.json({ msg: "Cocktail added successfully" });
                    }
                }
            );
        }
    });
}

function editCocktail(req, res) {
    var { name, icon, recipe } = req.body;

    console.log("PUT /COCKTAILS");

    if (!name || !icon || !recipe) {
        return res
            .status(400)
            .json({ msg: "Please enter a name, icon and recipe" });
    }
    db.query(
        "UPDATE cocktails SET name = ?, icon = ?, recipe = ? WHERE id = ?",
        [name, icon, JSON.stringify(recipe), req.params.id],
        (err, results) => {
            if (err) {
                res.status(500).json({ msg: "Error editing cocktail" });
            } else {
                res.json({ msg: "Cocktail edited" });
            }
        }
    );
}

function deleteCocktail(req, res) {
    db.query(
        "DELETE FROM cocktails WHERE id = ?",
        [req.params.id],
        (err, results) => {
            if (err) {
                res.status(500).json({ msg: "Error deleting cocktail" });
            } else {
                res.json({ msg: "Cocktail deleted" });
            }
        }
    );
}

module.exports = {
    getCocktails,
    newCocktail,
    editCocktail,
    deleteCocktail,
};

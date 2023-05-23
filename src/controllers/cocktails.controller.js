const db = require("../config/db");
const fs = require("fs");

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
    var { name, description, collections, recipe } = req.body;

    if (!image || !description || !collections || !recipe) {
        return res
        .status(400)
        .json({ msg: "Please enter all fields" });
    }

    console.log("POST /COCKTAILS");

    try {
        JSON.parse(recipe);
    } catch (err) {
        return res.status(400).json({ msg: "Please enter a valid recipe" });
    }

    if (!image.mimetype.startsWith("image")) {
        return res.status(400).json({ msg: "Please upload an image file" });
    }

    var imagePath = '/cocktails/' + image.name;
    image.mv('./public' + imagePath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: "Error uploading image" });
        } else {
            console.log("Image uploaded");

            db.query(
                "INSERT INTO cocktails (name, image, description, collections, recipe) VALUES (?, ?, ?, ?, ?)",
                [name, imagePath, description, collections, JSON.stringify(recipe)],
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
    var { image } = req.files;
    var { name, description, collections, recipe } = req.body;

    console.log("PUT /COCKTAILS");

    if (!name || !description || !collections || !recipe) {
        return res
            .status(400)
            .json({ msg: "Please enter all fields" });
    }

    try {
        JSON.parse(recipe);
    } catch (err) {
        return res.status(400).json({ msg: "Please enter a valid recipe" });
    }

    if (image) {
        if (!image.mimetype.startsWith("image")) {
            return res.status(400).json({ msg: "Please upload an image file" });
        }

        var imagePath = '/cocktails/' + image.name;
        image.mv('./public' + imagePath, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ msg: "Error uploading image" });
            } else {
                console.log("Image uploaded");

                // Get old image path
                db.query("SELECT image FROM cocktails WHERE id = ?", [req.params.id], (err, results) => {
                    if (err) {
                        res.status(500).json({ msg: "Error editing cocktail" });
                    } else {
                        var oldImagePath = results[0].image;

                        // Update cocktail
                        db.query("UPDATE cocktails SET name = ?, image = ?, description = ?, collections = ?, recipe = ? WHERE id = ?",
                            [name, imagePath, description, collections, JSON.stringify(recipe), req.params.id], (err, results) => {
                                if (err) {
                                    res.status(500).json({ msg: "Error editing cocktail" });
                                } else {

                                    // delete old image
                                    fs.unlink('./public' + oldImagePath, (err) => {
                                        if (err) {
                                            console.error(err);
                                            return res.status(500).json({ msg: "Error deleting old image" });
                                        } else {
                                            console.log("Old image deleted");
                                        }
                                    });

                                }
                            }
                        );
                    }
                });
            }
        });
    } else {
        db.query(
            "UPDATE cocktails SET name = ?, recipe = ?, collections = ?, description = ? WHERE id = ?",
            [name, JSON.stringify(recipe), collections, description, req.params.id],
            (err, results) => {
                if (err) {
                    res.status(500).json({ msg: "Error editing cocktail" });
                } else {
                    res.json({ msg: "Cocktail edited successfully" });
                }
            }
        );
    }
}

function deleteCocktail(req, res) {
    db.query(
        "DELETE FROM cocktails WHERE id = ?",
        [req.params.id],
        (err, results) => {
            if (err) {
                if (err.code === "ER_ROW_IS_REFERENCED_2") {
                    res.status(404).json({ msg: "Cocktail not found" });
                } else {
                    res.status(500).json({ msg: "Error deleting cocktail" });
                }
            } else {
                res.json({ msg: "Cocktail deleted successfully" });
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

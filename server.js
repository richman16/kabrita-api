const express = require("express");
const cors = require("cors");
const getSheetData = require("./lib");
const app = express();

app.use(cors());

app.get('/', async (req, res) => {
    try {
        const data = await getSheetData();
        res.json( { success: true, data } );
    } catch (error) {
        res.status(500).json( {success: false, error} );
    }
    // res.send("Hola mundo desde Kabrita API");
} );

app.listen(9000, () => {
    console.log("Server runing on http://localhost:9000");
} );
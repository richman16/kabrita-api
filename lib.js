const GoogleSpreadsheet = require("google-spreadsheet");
const async = require("async");

const getSheetData = () => new Promise( ( resolve, reject ) => {
    // spreadsheet key is the long id in the sheets URL
    // const doc = new GoogleSpreadsheet("<spreadsheet key>");
    const doc = new GoogleSpreadsheet("1V0MnIjVknUrSL0cYirkNce8ZZ30RB_iw2nFOi4Fvsm4");
    let sheet;

    async.series(
        [
            function setAuth(step) {
                // see notes below for authentication instructions!
                var creds = require("./google-generated-creds.json");
                // OR, if you cannot save the file locally (like on heroku)
                // var creds_json = {
                //     client_email: "yourserviceaccountemailhere@google.com",
                //     private_key: "your long private key stuff here"
                // };

                doc.useServiceAccountAuth(creds, step);
            },
            function getInfoAndWorksheets(step) {
                doc.getInfo(function(err, info) {
                    console.log("Loaded doc: " + info.title + " by " + info.author.email);
                    sheet = info.worksheets[0];
                    console.log(
                        "sheet 1: " +
                        sheet.title +
                        " " +
                        sheet.rowCount +
                        "x" +
                        sheet.colCount
                    );
                    step();
                });
            },
            function workingWithRows(step) {
                // google provides some query options
                sheet.getRows(
                    {
                        offset: 1,
                        // limit: 20,
                        // orderby: "col2"
                    },
                    function(err, rows) {
                        console.log("Read " + rows.length + " rows");

                        const columns = [
                            "datarecordid",
                            "username",
                            "fecha",
                            "ubicaciónlatitude",
                            "ubicaciónlongitude",
                            "ubicaciónaddress",
                            "ubicaciónaltitude",
                            "ubicaciónaccuracy",
                            "acompañadopor",
                            "medico",
                            "tipodevisitaenelmes",
                            "nombre",
                            "especialidad",
                            "cedula",
                            "direccion",
                            "calle",
                            "colonia",
                            "ciudad",
                            "telefono",
                            "movil",
                            "mail",
                            "seleccionedatosqueac",
                            "trabajaconasegurador",
                            "diasquerecibe",
                            "horainicio",
                            "horafinal",
                            "numerodepacientesema",
                            "consulta",
                            "sesolicitabaja",
                            "sesolicitabaja.comment"
                        ];

                        // the row is an object with keys set by the column headers
                        // rows[0].colname = "new val";
                        // rows[0].save(); // this is async

                        // deleting a row
                        // rows[0].del(); // this is async

                        // for(const row of rows) {
                        //     console.log(row);
                        // }

                        const formattedRows = [];
                        for (const row of rows) {
                            const formattedRow = {};
                            for (const column of columns) {
                                formattedRow[column] = row[column];
                            }
                            formattedRows.push(formattedRow);
                        }
                        resolve(formattedRows);


                        resolve(rows);

                        step();
                    }
                );
            },
        ],
        function(err) {
            if (err) {
                console.log("Error: " + err);
                reject(err);
            }
        }
    );
} );

module.exports = getSheetData;
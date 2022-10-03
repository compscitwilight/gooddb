import Command from "../command";
import globals from "../globals";
import * as CRUD from "../../data/crud"
export default {
    name: "set <cell> <value>",
    description: "Sets an existing cell value.",
    invoke: function (args: string[]) {
        if (!globals.connectedToDB) return console.log("You must be connected to a database to use that command.")

        let cellName = args[1]
        let cellValue = args[2]

        if (!cellName) return console.log("Missing cell argument.")
        if (!cellValue) return console.log("Missing value argument.")

        let [status, response] = CRUD.setCell(cellName, cellValue, globals.database, globals.databasePassword)
        console.log(response)
    }
} as Command
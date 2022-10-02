import Command from "../command";
import globals from "../globals";
import * as CRUD from "../../data/crud"
export default {
    name: "export <password>",
    description: "Exports all data from the connected database.",
    invoke: function (args: string[]) {
        if (!globals.connectedToDB) return console.log("You must be connected to a database to export data.")

        let password = args[1]
        if (!password) return console.log("Missing password argument")

        CRUD.exportDatabase(globals.database, password)
    }
} as Command
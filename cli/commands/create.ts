import Command from "../command";
import * as CRUD from "../../data/crud"
import globals from "../globals";
import QueryType from "../enums/ContextType";

const DatabaseNameLimit = 75
const DatabaseNameMin = 3

export default {
    name: "create <cellType?> <name> <value?> <password?>",
    description: "Creates a database or cell depending on the context.",
    invoke: function (args: string[]) {
        let context: QueryType = globals.connectedToDB ? QueryType.Cell : QueryType.Database

        switch (context) {
            case QueryType.Database:
                let dbName = args[1]
                let dbPassword = args[2]
                if (!dbName) return console.log("Missing name argument.")
                if (!dbPassword) return console.log("Missing password argument.")

                CRUD.createDatabase(dbName, dbPassword)
                break
            case QueryType.Cell:
                let cellType = args[1]
                let cellName = args[2]
                let cellValue = args[3]

                if (!cellType) return console.log("Missing cellType argument.")
                if (!cellName) return console.log("Missing name argument.")
                if (!cellValue) return console.log("Missing value argument.")


                break
        }
    }
} as Command
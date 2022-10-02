import Command from "../command";
import * as CRUD from "../../data/crud"
import globals from "../globals";
import QueryType from "../enums/QueryType";
export default {
    name: "del <query> <password?>",
    description: "Deletes a database or cell depending on the context.",
    invoke: function (args: string[]) {
        let query = args[1]
        if (!query) return console.log("Missing query argument.")

        let connectedToDB = globals.connectedToDB
        let queryType: QueryType = connectedToDB ? QueryType.Cell : QueryType.Database
        switch (queryType) {
            case QueryType.Database:
                let password = args[2]
                if (!password) return console.log("Missing password argument.")
                let [success, res] = CRUD.deleteDatabase(query, password)
                console.log(res)
                break
            case QueryType.Cell:

                break
        }
    }
} as Command
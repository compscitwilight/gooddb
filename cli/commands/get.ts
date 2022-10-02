import Command from "../command";
import Globals from "../globals"
import Database from "../../interfaces/Database";
import Schema from "../../data/databases/schema.json"
import * as CRUD from "../../data/crud"

export enum QueryType {
    Database,
    Cell
}

export default {
    name: "get <query>",
    description: "Fetches a cell or database. The data returned is based on the context.",
    invoke: function (args: string[]) {
        let query = args[1]
        if (!query) return console.log("Missing query argument.")

        query = query.toLowerCase()

        let connected = Globals.connectedToDB
        let queryType: QueryType = QueryType.Cell

        if (!connected) queryType = QueryType.Database

        switch (queryType) {
            case QueryType.Database:
                if (query == "*") {
                    let databases = CRUD.getAllDatabases()
                    console.log(`Found ${databases.length} databases:`)
                    databases.forEach((database) => {
                        if (!database) return console.log("Unknown Database")
                        console.log(`${database.name} | ${database.stats.size}`)
                    })
                    return
                }

                let dbData = CRUD.getDatabase(query)
                if (!dbData) return console.log(`No results found for "${query}".`)
                console.log(`Found database: ${dbData.name} | ${dbData.stats.size} | ${dbData.stats.birthtime}`)
                break
            case QueryType.Cell:
                if (query == "*") {
                    let dbData = CRUD.readDatabase(Globals.database)
                    if (!dbData) return console.log("Cannot fetch database cells.")

                    let renderCount = dbData.length > 10 ? 10 : dbData.length
                    let remainingCount = dbData.length - renderCount

                    for (var i = 0; i < renderCount; i++) {
                        let data = dbData[i]
                        console.log(data)
                    }

                    if (dbData.length > renderCount) console.log(`...${remainingCount} records`)
                    return
                }

                let cellData = CRUD.getKey(query, Globals.database, Globals.databasePassword)
                console.log(cellData)

                break
        }
    }
} as Command
import Command from "../command";
import Globals from "../globals"
import ContextType from "../enums/ContextType";
import * as CRUD from "../../data/crud"
import { Stats } from "fs"
export default {
    name: "get <query>",
    description: "Fetches a cell or database. The data returned is based on the context.",
    invoke: function (args: string[]) {
        let query = args[1]
        if (!query) return console.log("Missing query argument.")

        query = query.toLowerCase()

        let connected = Globals.connectedToDB
        let queryType: ContextType = ContextType.Cell

        if (!connected) queryType = ContextType.Database

        switch (queryType) {
            case ContextType.Database:
                if (query == "*") {
                    let [dbStatus, databases] = CRUD.getAllDatabases()
                    console.log(`Found ${databases.length} databases:`)
                    databases.forEach((database) => {
                        if (!database) return console.log("Unknown Database")
                        console.log(`${database.name} | ${database.stats.size}`)
                    })
                    return
                }

                let [dataStatus, dbData] = CRUD.getDatabase(query)
                if (!dataStatus) return console.log(`No results found for "${query}".`)

                let data = (dbData as { name: string, stats: Stats })
                console.log(`Found database: ${data.name} | ${data.stats.size} | ${data.stats.birthtime}`)
                break
            case ContextType.Cell:
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

                let cellData = CRUD.getCell(query, Globals.database, Globals.databasePassword)
                console.log(cellData)

                break
        }
    }
} as Command
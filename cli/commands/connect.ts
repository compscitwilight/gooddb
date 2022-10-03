import Command from "../command";
import Globals, { connectToDatabase, disconnectFromDatabase } from "../globals"
import * as CRUD from "../../data/crud"
import DatabaseStats from "../../interfaces/DatabaseStats";
export default {
    name: "connect <db_name> <db_password>",
    description: "Connects to a GoodDB database.",
    invoke: function (args: string[]) {
        let name = args[1]
        let password = args[2]

        if (!name) return console.log("Missing name argument")
        if (!password) return console.log("Missing password argument")

        name = name.toLowerCase()
        let [status, database] = CRUD.getDatabase(name)
        if (!status) return console.log(`Invalid database "${name}"`)
        database = (database as DatabaseStats)

        let validPassword = CRUD.validatePassword(name, password)
        if (!validPassword) return console.log("Incorrect password")

        if (Globals.connectedToDB) {
            console.log(`Disconnecting from ${Globals.database}...`)
            disconnectFromDatabase()
            console.log("Disconnected")
        }

        Globals.connectedToDB = true
        Globals.database = database.name.split(".")[0]
        Globals.cursor = `database:${Globals.database}> `
        Globals.databasePassword = password
        console.log(`Successfully connected to ${Globals.database}`)
    }
} as Command
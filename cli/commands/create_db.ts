import Command from "../command";
import * as CRUD from "../../data/crud"

const DatabaseNameLimit = 75
const DatabaseNameMin = 3

export default {
    name: "create_db <db_name> <db_password>",
    description: "Creates a database.",
    invoke: function (args: string[]) {
        let name = args[1]
        let password = args[2]

        if (!name) return console.log("Please enter a valid database username.")
        if (!password) return console.log("Please enter a valid database password.")

        if (name.length > DatabaseNameLimit)
            return console.log(`Database name cannot exceed ${DatabaseNameLimit} characters.`)

        if (name.length < DatabaseNameMin)
            return console.log(`Database name must be ${DatabaseNameMin} or more characters.`)

        CRUD.createDatabase(name, password)
    }
} as Command
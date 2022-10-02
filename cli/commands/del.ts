import Command from "../command";
import * as CRUD from "../../data/crud"
export default {
    name: "del <db_name> <db_password>",
    description: "Deletes a database (password required).",
    invoke: function (args: string[]) {
        let name = args[1]
        let password = args[2]

        if (!name) return console.log("Missing name argument")
        if (!password) return console.log("Missing password argument")

        let database = CRUD.getDatabase(name)
        if (!database) return console.log(`Database ${name} does not exist.`)
    }
} as Command
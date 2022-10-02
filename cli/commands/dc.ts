import Command from "../command";
import Globals, { disconnectFromDatabase } from "../globals"
export default {
    name: "dc",
    description: "Disconnects from the current database.",
    invoke: function (args: string[]) {
        if (!Globals.connectedToDB) {
            console.log("You are not connected to a GoodDB database.")
            return
        }

        disconnectFromDatabase()
        console.log("Disconnected")
    }
} as Command
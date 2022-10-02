import Command from "../command";
import * as fs from "fs"
export default {
    name: "help",
    description: "Provides a list of all commands.",
    invoke: function (args: string[]) {
        let headerLine = "=".repeat(25)
        let headerText = "GoodDB - Help"

        let commands = fs.readdirSync(__dirname)
        let commandData: Command[] = commands.map((cmd) => {
            let data: Command = require(`./${cmd}`).default
            return data
        })

        console.log(`${headerLine} ${headerText} ${headerLine}`)
        commandData.forEach((command) => {
            console.log(`${command.name} ~ ${command.description}`)
        })
    }
} as Command
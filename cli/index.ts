import * as readline from "readline"
import * as fs from "fs"
import Command from "./command"
import globals from "./globals"
import pckg from "../package.json"

const readlineInterface = readline.createInterface({ input: process.stdin, output: process.stdout })
const CommandsDir = "/commands/"

function start() {
    welcome()
    question()
}

function welcome() {
    console.log(`Welcome to the GoodDB Command-Line Interface (GDB-CLI). Run <help> for a list of commands. (v${pckg.version})`)
}

function question() {
    readlineInterface.question(globals.cursor, (res: string) => {
        res = res.toLowerCase()

        let args = res.split(" ")
        let cmd = args[0]
        let commandPath = `${__dirname}${CommandsDir}${cmd}.ts`

        if (!fs.existsSync(commandPath)) {
            console.log("Invalid command.")
            return question()
        }

        let module: Command = require(commandPath).default

        // converting enviornment variable to their value
        let env = globals.enviornmentVariables
        for (var i = 0; i < args.length; i++) {
            let arg = args[i].toLowerCase()
            if (arg.startsWith("env:")) {
                let variable = arg.split("env:")[1]
                let value = env.get(variable)
                if (!value) {
                    console.log(`An enviornment variable with the name "${variable}" does not exist. (see <env>)`)
                    return question()
                }

                args[args.indexOf(arg)] = value
            }
        }

        module.invoke(args)
        question()
    })
}

start()
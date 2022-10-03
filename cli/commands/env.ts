import Command from "../command";
import globals from "../globals";
export default {
    name: "env <list | get | set | del> <key?> <value?>",
    description: "Allows you to define enviornment variables.",
    invoke: function (args: string[]) {
        let action = args[1]
        if (!action) return console.log("Missing argument 1.")
        action = action.toLowerCase()

        let env = globals.enviornmentVariables
        switch (action) {
            case "list":
                if (env.size == 0) return console.log("There aren't any defined enviornment variables.")
                env.forEach((value: string, key: string) => {
                    console.log(`${key}=${value} (env:${key})`)
                })
                break
            case "get":
                let fetchName = args[2]
                if (!fetchName) return console.log("Missing key argument")

                let value = env.get(fetchName)
                if (!value) return console.log(`Enviornment variable "${fetchName}" does not exist.`)
                console.log(value)
                break
            case "set":
                let setName = args[2]
                let setValue = args.slice(3).join(" ")
                if (!setName) return console.log("Missing key argument")
                if (!setValue) return console.log("Missing value argument")

                /*
                let saveFlag = args[4]
                if (saveFlag && saveFlag.toLowerCase() == "--save") {

                }
                */
                env.set(setName, setValue)
                console.log(`Set enviornment variable "${setName}" to "${setValue}"`)
                break
            case "del":
                let delName = args[2]
                if (!delName) return console.log("Missing key argument")
                if (!env.has(delName)) return console.log(`Enviornment variable "${delName}" does not exist.`)

                let delValue = env.get(delName)
                env.delete(delName)
                console.log(`Deleted enviornment variable ${delName} (value: ${delValue}).`)
                break
        }
    }
} as Command
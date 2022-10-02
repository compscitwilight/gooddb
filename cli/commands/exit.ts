import Command from "../command";
export default {
    name: "exit",
    description: "Exits the terminal window.",
    invoke: function (args: string[]) {
        process.exit(0)
    }
} as Command
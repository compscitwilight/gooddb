import * as CRUD from "../data/crud"

let DefaultCursor = "gooddb> "
let globals = {
    database: "",
    databasePassword: "",
    connectedToDB: false,
    cursor: DefaultCursor,
    enviornmentVariables: new Map<string, string>()
}

export function disconnectFromDatabase() {
    if (!globals.connectedToDB) return
    globals.connectedToDB = false
    globals.database = ""
    globals.databasePassword = ""
    globals.cursor = DefaultCursor
}

export function connectToDatabase(name: string, password: string) {

}

export function goPath(dir: string) {
    let cursor = globals.cursor
    globals.cursor = `${cursor}/${dir}> `
}

export default globals
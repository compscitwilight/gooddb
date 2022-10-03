import settings from "../settings.json"
import * as fs from "fs"
import schema from "./databases/schema.json"
import Database from "../interfaces/Database"
import DataTypes from "./DataTypes"

const DatabasesPath = `${__dirname}/databases`
const DatabasesSchema = `${DatabasesPath}/schema.json`
const ExportsPath = `${__dirname}/exports`

/**
 * Fetches a database by it's name, and returns it's stats.
 * @param name The name of the database being queried 
 * @returns 
 */
export function getDatabase(name: string) {
    name = name.toLowerCase()

    let databases = fs.readdirSync(DatabasesPath)
    let database = databases.find((db) => {
        return db == `${name}.${settings.databaseExtension}`
    })

    if (!database) return [false, "Database doesn't exist."]

    let path = `${DatabasesPath}/${database}`
    let data = fs.statSync(path)

    return [true, {
        name: database,
        stats: data
    }]
}

export function getAllDatabases() {
    return schema.map((database: Database) => {
        return getDatabase(database.name)
    })
}

/**
 * Creates a database file inside of /databases, and adds the database to /databases/schema.json
 * @param name The name of the database
 * @param password The password for the database
 * @returns 
 */
export function createDatabase(name: string, password: string) {
    name = name.toLowerCase()
    name = name.replace(/ g/, "_")

    let existingDbSchema = schema.find((s: { name: string }) => {
        return s.name == name
    })

    if (existingDbSchema) return console.log(`A database with the name "${name}" already exists.`)

    schema.push({
        name: name,
        password: password,
        created: Date.now()
    })

    fs.writeFileSync(DatabasesSchema, JSON.stringify(schema))

    let path = `${DatabasesPath}/${name}.${settings.databaseExtension}`
    let template = fs.readFileSync(`${__dirname}/template.gdbd`)
    fs.writeFileSync(path, template)

    return console.log(`Successfully created database ${name}.`)
}

export function exportDatabase(name: string, password: string) {
    let exportJson = `${ExportsPath}/export_${name}_${Date.now()}.json`
    let database = getDatabase(name)

    if (!database) return console.log("Database doesn't exist.")

    let passwordCorrect = validatePassword(name, password)
    if (!passwordCorrect) return console.log("Incorrect password.")

    fs.writeFileSync(exportJson, "")
}

export function readDatabase(dbName: string) {
    let databaseExists = getDatabase(dbName)
    if (!databaseExists) return console.log("Database does not exist.")

    let path = `${DatabasesPath}/${dbName}.${settings.databaseExtension}`
    if (!fs.existsSync(path)) return console.log("Database file may be corrupted.")

    return fs.readFileSync(path, "utf-8").split(" ")
}

export function deleteDatabase(name: string, password: string) {
    let database = getDatabase(name)
    if (!database) return [false, `Database "${name}" does not exist.`]

    let passwordValid = validatePassword(name, password)
    if (!passwordValid) return [false, "Invalid password"]

    let databasePath = `${DatabasesPath}/${name}.${settings.databaseExtension}`
    if (!fs.existsSync(databasePath)) return [false, "Database file does not exist."]

    let dbCredentials = schema.find((db: Database) => {
        return db.name == name
    })
    if (!dbCredentials) return [false, "Couldn't find database in schema.json, therefore it does not exist inside of GoodDB."]

    let index = schema.indexOf(dbCredentials)
    schema.splice(index, 1)

    let content = JSON.stringify(schema)

    fs.writeFileSync(DatabasesSchema, content)
    fs.rmSync(databasePath)
    return [true, `Successfully deleted ${name}.`]
}

export function validatePassword(name: string, password: string) {
    let database: Database = schema.find((db: Database) => {
        return db.name == name
    })

    if (!database) return false
    return database.password == password
}

export function getCell(key: string, dbName: string, dbPassword: string) {
    let validated = validatePassword(dbName, dbPassword)
    if (!validated) return console.log("Incorrect password.")

    let database = getDatabase(dbName)
    if (!database) return console.log("Database doesn't exist.")

    let data = readDatabase(dbName)
    if (!data) return console.log("There was an issue while fetching the database cells.")
    let row = data.find((r) => {
        let rowKey = r.split("=")[0]
        let value = r.split("=")[1]
        return rowKey == key
    })

    if (!row) return console.log(`Couldn't find "${key}".`)
    return row
}

export function createCell(type: DataTypes, name: string, value: string, dbName: string, dbPassword: string) {
    let database = getDatabase(dbName)
    if (!database) return [false, `Database "${dbName}" does not exist.`]

    let passwordCorrect = validatePassword(dbName, dbPassword)
    if (!passwordCorrect) return [false, "Incorrect password."]

    let path = `${DatabasesPath}/${dbName}.${settings.databaseExtension}`
    if (!fs.existsSync(path)) return [false, "Database file does not exist."]

    let data = readDatabase(dbName)
    if (!data) return [false, "Couldn't read database."]

    let text: string = ""
    data.push(` ${type}:${name}=${value} `)

    for (var i = 0; i < data.length; i++) {
        let row = data[i]
        text += row
    }

    fs.writeFileSync(path, text)

    return [true, `Created ${type}:${name}=${value}.`]
}
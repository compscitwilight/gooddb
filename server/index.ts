import express, { Request, Response } from "express";
import settings from "../settings.json"
import * as Service from "./service"
import * as path from "path"

let Server = express()
let Port = settings.serverPort

Server.use(express.urlencoded({ extended: false }))
Server.use(express.json())

Server.set("scripts", path.join(__dirname, "scripts"))
Server.set("styles", path.join(__dirname, "styles"))

Server.get("/", (req: Request, res: Response) => {
    res.sendFile("./views/intro.html", { root: __dirname })
})

/**
 * domain/<db_username>/<db_password> (db_username: string, db_password: string)
 * Entry point URL which connects the client to the database.
 */
Server.post("/connect", (req: Request, res: Response) => {
    let params: {
        db_username?: string,
        db_password?: string
    } = req.body
    console.log(params)
    if (!params) return res.status(500).send("Body could not be found.")
    if (!params.db_username) return res.status(400).send("Please provide a username field.")
    if (!params.db_password) return res.status(400).send("Please provide a password field.")

    let valid = Service.authenticateDatabase(req.session, params.db_username, params.db_password)
    if (valid) return res.status(200).redirect("/database")
    return res.status(401).redirect("/")
})

Server.post("/disconnect", (req: Request, res: Response) => {
    Service.sessionLogout(req.session)
    return res.redirect("/")
})

/**
 * domain/db/<store_name>
 * Fetch, create, delete, and update stores inside of the database.
 */
Server.all("/db/:cell", (req: Request, res: Response) => {
    let method = req.method

})

/**
 * domain/db/actions/std (no parameters)
 * Save the current data in-memory to the disk.
 */
Server.post("/db/actions/std", (req: Request, res: Response) => {

})

Server.get("/db/actions/export", (req: Request, res: Response) => {

})

try {
    Server.listen(Port)
    console.log("GoodDB server is now online.")
} catch {
    console.error(`The GoodDB port specified \`${Port}\` is currently occupied. Change serverPort in gooddb/settings.json`)
}
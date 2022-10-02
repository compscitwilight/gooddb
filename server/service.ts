import { Session } from "express-session";
import * as CRUD from "../data/crud"

let Sessions = new Map<Session, SessionData>()

export interface SessionData {
    dbName: string
    password: string
    authenticated: boolean
}

export function authenticateDatabase(session: Session, dbName: string, dbPassword: string) {
    let database = CRUD.getDatabase(dbName)
    if (!database) return

    let correctPassword = CRUD.validatePassword(dbName, dbPassword)
    if (!correctPassword) return

    let data = getSessionDatabase(session)
    data.dbName = dbName
    data.password = dbPassword
    data.authenticated = true
    console.log(`Successfully authenticated in database ${dbName}`)
}

export function getSessionDatabase(session: Session) {
    if (!Sessions.has(session))
        Sessions.set(session, {
            dbName: "",
            password: "",
            authenticated: false
        })
    let sessionData = Sessions.get(session)
    return sessionData
}

export function sessionLogout(session: Session) {
    let data = getSessionDatabase(session)
    data.dbName = ""
    data.password = ""
    data.authenticated = false
}

export function isAuthenticated(session: Session) {
    let data = getSessionDatabase(session)
    return data.authenticated
}
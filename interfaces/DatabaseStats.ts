import { Stats } from "fs"
export default interface DatabaseStats {
    name: string
    stats: Stats
}
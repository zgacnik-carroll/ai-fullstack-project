// FILE: backend/src/main/kotlin/com/app/DatabaseFactory.kt
package com.app

import com.app.models.Sightings
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.File

object DatabaseFactory {
    fun init() {
        File("data").mkdirs()
        Database.connect("jdbc:sqlite:data/app.db", driver = "org.sqlite.JDBC")
        transaction {
            SchemaUtils.createMissingTablesAndColumns(Sightings)
            if (Sightings.selectAll().empty()) {
                Sightings.insert {
                    it[species] = "Bald Eagle"
                    it[location] = "Lake Superior, MN"
                    it[latitude] = 47.8526
                    it[longitude] = -90.2987
                    it[observedAt] = "2024-06-15T08:30:00Z"
                    it[notes] = "Observed hunting near the shoreline"
                    it[createdAt] = "2024-06-15T09:00:00Z"
                }
                Sightings.insert {
                    it[species] = "Gray Wolf"
                    it[location] = "Yellowstone National Park, WY"
                    it[latitude] = 44.4280
                    it[longitude] = -110.5885
                    it[observedAt] = "2024-07-02T06:15:00Z"
                    it[notes] = "Pack of three crossing the river"
                    it[createdAt] = "2024-07-02T07:00:00Z"
                }
                Sightings.insert {
                    it[species] = "Monarch Butterfly"
                    it[location] = "Pacific Grove, CA"
                    it[latitude] = 36.6177
                    it[longitude] = -121.9166
                    it[observedAt] = "2024-10-20T14:00:00Z"
                    it[notes] = "Large migration cluster in eucalyptus trees"
                    it[createdAt] = "2024-10-20T14:30:00Z"
                }
            }
        }
    }
}

// FILE: backend/src/main/kotlin/com/app/models/Sighting.kt
package com.app.models

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.dao.id.IntIdTable

object Sightings : IntIdTable("sightings") {
    val species    = varchar("species", 255)
    val location   = varchar("location", 255)
    val latitude   = double("latitude")
    val longitude  = double("longitude")
    val observedAt = varchar("observed_at", 50)
    val notes      = varchar("notes", 1000).default("")
    val createdAt  = varchar("created_at", 50)
}

@Serializable
data class Sighting(
    val id: Int,
    val species: String,
    val location: String,
    val latitude: Double,
    val longitude: Double,
    val observed_at: String,
    val notes: String,
    val created_at: String
)

@Serializable
data class CreateSighting(
    val species: String,
    val location: String,
    val latitude: Double,
    val longitude: Double,
    val observed_at: String,
    val notes: String = ""
)

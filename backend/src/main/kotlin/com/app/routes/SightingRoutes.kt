// FILE: backend/src/main/kotlin/com/app/routes/SightingRoutes.kt
package com.app.routes

import com.app.models.CreateSighting
import com.app.models.Sighting
import com.app.models.Sightings
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.Instant

@Serializable
data class ErrorResponse(val error: String)

@Serializable
data class SightingsResponse(val sightings: List<Sighting>)

@Serializable
data class SpeciesResponse(val species: List<String>)

fun Application.sightingRoutes() {
    routing {
        route("/api/sightings") {

            // GET /api/sightings
            get {
                try {
                    val speciesFilter = call.request.queryParameters["species"]
                    val dateFrom = call.request.queryParameters["date_from"]
                    val dateTo = call.request.queryParameters["date_to"]

                    val sightings = transaction {
                        var query = Sightings.selectAll()
                        if (!speciesFilter.isNullOrBlank()) {
                            query = query.andWhere { Sightings.species eq speciesFilter }
                        }
                        if (!dateFrom.isNullOrBlank()) {
                            query = query.andWhere { Sightings.observedAt greaterEq dateFrom }
                        }
                        if (!dateTo.isNullOrBlank()) {
                            query = query.andWhere { Sightings.observedAt lessEq dateTo }
                        }
                        query.map { it.toSighting() }
                    }
                    call.respond(HttpStatusCode.OK, SightingsResponse(sightings))
                } catch (e: Exception) {
                    call.respond(HttpStatusCode.InternalServerError, ErrorResponse(e.message ?: "Unexpected error"))
                }
            }

            // GET /api/sightings/:id
            get("{id}") {
                try {
                    val id = call.parameters["id"]?.toIntOrNull()
                        ?: return@get call.respond(HttpStatusCode.BadRequest, ErrorResponse("Invalid id"))

                    val sighting = transaction {
                        Sightings.selectAll().where { Sightings.id eq id }.singleOrNull()?.toSighting()
                    }
                    if (sighting == null) {
                        call.respond(HttpStatusCode.NotFound, ErrorResponse("Sighting not found"))
                    } else {
                        call.respond(HttpStatusCode.OK, sighting)
                    }
                } catch (e: Exception) {
                    call.respond(HttpStatusCode.InternalServerError, ErrorResponse(e.message ?: "Unexpected error"))
                }
            }

            // POST /api/sightings
            post {
                try {
                    val body = call.receive<CreateSighting>()
                    if (body.species.isBlank() || body.location.isBlank()) {
                        return@post call.respond(HttpStatusCode.BadRequest, ErrorResponse("species and location are required"))
                    }
                    val now = Instant.now().toString()
                    val created = transaction {
                        val stmt = Sightings.insert {
                            it[species]    = body.species
                            it[location]   = body.location
                            it[latitude]   = body.latitude
                            it[longitude]  = body.longitude
                            it[observedAt] = body.observed_at
                            it[notes]      = body.notes
                            it[createdAt]  = now
                        }
                        Sighting(
                            id          = stmt[Sightings.id].value,
                            species     = body.species,
                            location    = body.location,
                            latitude    = body.latitude,
                            longitude   = body.longitude,
                            observed_at = body.observed_at,
                            notes       = body.notes,
                            created_at  = now
                        )
                    }
                    call.respond(HttpStatusCode.OK, created)
                } catch (e: Exception) {
                    call.respond(HttpStatusCode.InternalServerError, ErrorResponse(e.message ?: "Unexpected error"))
                }
            }

            // PUT /api/sightings/:id
            put("{id}") {
                try {
                    val id = call.parameters["id"]?.toIntOrNull()
                        ?: return@put call.respond(HttpStatusCode.BadRequest, ErrorResponse("Invalid id"))

                    val body = call.receive<CreateSighting>()
                    val updated = transaction {
                        val rows = Sightings.update({ Sightings.id eq id }) {
                            it[species]    = body.species
                            it[location]   = body.location
                            it[latitude]   = body.latitude
                            it[longitude]  = body.longitude
                            it[observedAt] = body.observed_at
                            it[notes]      = body.notes
                        }
                        if (rows == 0) return@transaction null
                        Sightings.selectAll().where { Sightings.id eq id }.single().toSighting()
                    }
                    if (updated == null) {
                        call.respond(HttpStatusCode.NotFound, ErrorResponse("Sighting not found"))
                    } else {
                        call.respond(HttpStatusCode.OK, updated)
                    }
                } catch (e: Exception) {
                    call.respond(HttpStatusCode.InternalServerError, ErrorResponse(e.message ?: "Unexpected error"))
                }
            }

            // DELETE /api/sightings/:id
            delete("{id}") {
                try {
                    val id = call.parameters["id"]?.toIntOrNull()
                        ?: return@delete call.respond(HttpStatusCode.BadRequest, ErrorResponse("Invalid id"))

                    val deleted = transaction {
                        Sightings.deleteWhere { Sightings.id eq id }
                    }
                    if (deleted == 0) {
                        call.respond(HttpStatusCode.NotFound, ErrorResponse("Sighting not found"))
                    } else {
                        call.respond(HttpStatusCode.NoContent)
                    }
                } catch (e: Exception) {
                    call.respond(HttpStatusCode.InternalServerError, ErrorResponse(e.message ?: "Unexpected error"))
                }
            }
        }

        // GET /api/species
        get("/api/species") {
            try {
                val species = transaction {
                    Sightings.select(Sightings.species)
                        .map { it[Sightings.species] }
                        .distinct()
                        .sorted()
                }
                call.respond(HttpStatusCode.OK, SpeciesResponse(species))
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, ErrorResponse(e.message ?: "Unexpected error"))
            }
        }
    }
}

private fun ResultRow.toSighting() = Sighting(
    id          = this[Sightings.id].value,
    species     = this[Sightings.species],
    location    = this[Sightings.location],
    latitude    = this[Sightings.latitude],
    longitude   = this[Sightings.longitude],
    observed_at = this[Sightings.observedAt],
    notes       = this[Sightings.notes],
    created_at  = this[Sightings.createdAt]
)

#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate rocket;
extern crate rocket_contrib;

#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_codegen;
extern crate dotenv;

#[macro_use]
extern crate serde_derive;

extern crate serde;

pub mod schema;
pub mod models;

use std::io;
use std::path::{Path, PathBuf};
use rocket::response::NamedFile;
use rocket_contrib::Json;
use diesel::prelude::*;
use dotenv::dotenv;
use std::env;

use self::models::*;

#[derive(Serialize, Debug)]
pub struct JsonPreset {
    id: i32,
    tempo: f32,
    division: String,
    master_volume: i32,
    sequence_length: i32,
    channels: Vec<models::Channel>,
    sequences: Vec<models::Sequence>,
}

// TODO: connection pool
fn establish_connection() -> SqliteConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");

    SqliteConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url))
}

#[get("/")]
fn index() -> io::Result<NamedFile> {
    NamedFile::open("index.html")
}

#[get("/<preset_id>")] // TODO: integrate with above
fn index_with_id(preset_id: i32) -> io::Result<NamedFile> {
    NamedFile::open("index.html")
}

#[get("/assets/<file..>")]
fn assets(file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new("dist/").join(file)).ok()
}

#[get("/data/<request_id>")]
pub fn get_preset(request_id: i32) -> Json<JsonPreset> {
    use self::schema::presets::dsl::*;

    let connection = establish_connection();

    let preset = presets
        .filter(id.eq(&request_id))
        .load::<Preset>(&connection)
        .expect("Error loading presets");

    let preset_channels = Channel::belonging_to(&preset[0])
        .load::<Channel>(&connection)
        .expect("Error loading channels");

    let preset_sequences = Sequence::belonging_to(&preset[0])
        .load::<Sequence>(&connection)
        .expect("Error loading sequences");

    Json(JsonPreset {
        id: preset[0].id,
        tempo: preset[0].tempo,
        division: preset[0].division.to_string(),
        master_volume: preset[0].master_volume,
        sequence_length: preset[0].sequence_length,
        channels: preset_channels,
        sequences: preset_sequences,
    })
}

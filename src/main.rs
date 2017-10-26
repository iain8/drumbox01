#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate rocket;
#[macro_use] extern crate rocket_contrib;

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

use self::models::Preset;

#[derive(Serialize, Deserialize, Debug)]
struct JsonPreset {
    id: i32,
    inst_1: String,
    inst_2: String,
    inst_3: String,
    inst_4: String,
}

fn establish_connection() -> SqliteConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    
    SqliteConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url))
}

#[get("/data/<request_id>")]
fn get_preset(request_id: i32) -> Json<JsonPreset> {
    use self::schema::presets::dsl::*;

    let connection = establish_connection();

    let preset = presets
        .filter(id.eq(&request_id))
        .load::<Preset>(&connection)
        .expect("Error loading presets");
    
    Json(JsonPreset {
        id: preset[0].id,
        inst_1: preset[0].inst_1.clone(),
        inst_2: preset[0].inst_2.clone(),
        inst_3: preset[0].inst_3.clone(),
        inst_4: preset[0].inst_4.clone(),
    })
}

#[get("/")]
fn index() -> io::Result<NamedFile> {
    NamedFile::open("index.html")
}

#[get("/assets/<file..>")]
fn assets(file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new("dist/").join(file)).ok()
}

fn main() {
    rocket::ignite().mount("/", routes![index, assets, get_preset]).launch();
}

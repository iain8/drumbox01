extern crate iron;
extern crate staticfile;
extern crate mount;
extern crate router;

#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_codegen;
extern crate dotenv;

pub mod schema;
pub mod models;

use std::path::Path;
use diesel::prelude::*;
use dotenv::dotenv;
use std::env;

use iron::prelude::*;
use iron::status;
use router::Router;

use staticfile::Static;
use mount::Mount;

fn establish_connection() -> SqliteConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    
    SqliteConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url))
}

fn get_preset(req: &mut Request) -> IronResult<Response> {
    let ref id = req.extensions.get::<Router>().unwrap().find("id").unwrap_or("/");
    Ok(Response::with((status::Ok, *id)))
}

fn chain() -> iron::Chain {
    let mut router = Router::new();

    router.get("/:id", get_preset, "data");

    let mut mount = Mount::new();

    mount.mount("/", Static::new(Path::new("index.html")));
    mount.mount("/js/", Static::new(Path::new("dist/js")));
    mount.mount("/css/", Static::new(Path::new("dist/css")));
    mount.mount("/lib/", Static::new(Path::new("dist/lib")));
    mount.mount("/data/", router);

    iron::Chain::new(mount)
}

fn main() {
    // let connection = establish_connection();

    println!("server running at http://localhost:3000/");

    // Iron::new(mount).http("127.0.0.1:3000").unwrap();

    Iron::new(chain()).http("localhost:3000").unwrap();
}

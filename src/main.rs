#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate rocket;
extern crate rocket_contrib;
extern crate drumbox01;

use drumbox01::*;

fn main() {
    rocket::ignite().mount("/", routes![assets, index, index_with_id, get_preset]).launch();
}

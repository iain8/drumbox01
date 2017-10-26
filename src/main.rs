extern crate iron;
extern crate staticfile;
extern crate mount;

use std::path::Path;

use iron::Iron;
use staticfile::Static;
use mount::Mount;

fn main() {
    let mut mount = Mount::new();

    mount.mount("/", Static::new(Path::new("index.html")));
    mount.mount("/js/", Static::new(Path::new("dist/js")));
    mount.mount("/css/", Static::new(Path::new("dist/css")));
    mount.mount("/lib/", Static::new(Path::new("dist/lib")));

    println!("server running at http://localhost:3000/");

    Iron::new(mount).http("127.0.0.1:3000").unwrap();
}

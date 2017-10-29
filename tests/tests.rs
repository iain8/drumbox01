extern crate drumbox01;

#[test]
fn basic() {
  let output = drumbox01::get_preset(1);

  println!("dinosaurs");
  println!("{:?}", output);

  assert_eq!(4, 2 + 2);
}

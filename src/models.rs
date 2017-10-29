use schema::{presets, channels};

#[derive(Identifiable, Queryable)]
pub struct Preset {
    pub id: i32,
}

#[derive(Identifiable, Queryable, Associations, Serialize, Debug)]
#[belongs_to(Preset)]
pub struct Channel {
    pub id: i32,
    pub preset_id: i32,
    pub name: String,
    pub options: String,
    pub pattern: String,
}

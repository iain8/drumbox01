use schema::{presets, channels, sequences};

#[derive(Identifiable, Queryable)]
pub struct Preset {
    pub id: i32,
    pub tempo: f32,
    pub division: i32,
    pub master_volume: i32,
    pub sequence_length: i32,
}

#[derive(Identifiable, Queryable, Associations, Serialize, Debug)]
#[belongs_to(Preset)]
pub struct Channel {
    pub id: i32,
    pub name: String,
    pub options: String,
    pub preset_id: i32,
}

#[derive(Identifiable, Queryable, Associations, Serialize, Debug)]
#[belongs_to(Preset)]
pub struct Sequence {
    pub id: i32,
    pub position: i32,
    pub pattern: String,
    pub preset_id: i32,
}

#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use serde::{Serialize, Deserialize};
use std::sync::Mutex;
use tauri::State;

#[derive(Serialize, Deserialize)]
struct Object{
  id: i32,
  x: i32,
  y: i32,
  rotation: i32,
  scale: i32,
  color: Color,
}

#[derive(Serialize, Deserialize)]
struct Color{
  r: i32,
  g: i32,
  b: i32,
  a: i32
}

struct Layers(Mutex<Vec<Vec<Vec<Object>>>>);
struct CurrentStroke(Mutex<Vec<Object>>);

fn add_stroke(layer:i32, stroke:Vec<Object>, layers: State<Layers>) {
  let mut lays = layers.0.lock().unwrap();

  if lays.len() < layer as usize {
    lays[layer as usize].push(stroke);
  }
}

fn add_object_to_stroke(stroke:&mut Vec<Object>, object:Object) {
  stroke.push(object);
}

#[tauri::command]
fn create_object(id:i32, x:i32, y:i32, rotation:i32, scale:i32, color:Color) -> Object {
  return Object{
    id: id,
    x: x,
    y: y,
    rotation: rotation,
    scale: scale,
    color: color
  };
}

#[tauri::command]
fn create_color(r:i32, g:i32, b:i32, a:i32) -> Color {
  return Color{
    r: r,
    g: g,
    b: b,
    a: a
  };
}

fn main() {

  tauri::Builder::default()
    .manage(Layers(Default::default()))
    .manage(CurrentStroke(Default::default()))
    .invoke_handler(tauri::generate_handler![
      create_color, 
      create_object
      ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

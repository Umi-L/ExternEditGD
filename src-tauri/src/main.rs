#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use serde::{Serialize, Deserialize};
use std::sync::Mutex;
use tauri::State;

#[derive(Serialize, Deserialize, Clone, Debug)]
struct Object{
  id: i32,
  x: f32,
  y: f32,
  rotation: f32,
  scale: i32,
  color: Color,
}

#[derive(Serialize, Deserialize, Copy, Clone, Debug, Default)]
struct Color{
  r: i32,
  g: i32,
  b: i32,
  a: f32
}


struct CurrentLayer(Mutex<usize>);
struct CurrentColor(Mutex<Color>);

struct Layers(Mutex<Vec<Vec<Vec<Object>>>>);
struct CurrentStroke(Mutex<Vec<Object>>);

#[tauri::command]
fn add_current_stroke(layer_mutex: State<CurrentLayer>, stroke_mutex: State<CurrentStroke>, layers_mutex: State<Layers>) {
  let current_layer = layer_mutex.0.lock().unwrap();
  let stroke = stroke_mutex.0.lock().unwrap();
  let mut layers = layers_mutex.0.lock().unwrap();


  // push duplicated layer to layers
  layers[*current_layer].push(stroke.to_vec());

  //println!("{:?}", layers);
}

#[tauri::command]
fn add_object_to_current_stroke(object:Object, stroke_mutex:State<CurrentStroke>) {
  let mut stroke = stroke_mutex.0.lock().unwrap();
  stroke.push(object);
}

#[tauri::command]
fn create_object(id:i32, x:f32, y:f32, rotation:f32, scale:i32, current_color_mutex:State<CurrentColor>) -> Object {

  let current_color = current_color_mutex.0.lock().unwrap();

  return Object{
    id: id,
    x: x,
    y: y,
    rotation: rotation,
    scale: scale,
    color: *current_color
  };
}

#[tauri::command]
fn create_color(r:i32, g:i32, b:i32, a:f32) -> Color {
  return Color{
    r: r,
    g: g,
    b: b,
    a: a
  };
}

#[tauri::command]
fn genorate_layers(ammount:usize, layers_mutex:State<Layers>){
  let mut layers = layers_mutex.0.lock().unwrap();

  if layers.len() >= ammount{
    return;
  }
  
  for _ in 0..(ammount - layers.len()){
    layers.push(Vec::new());
  }
}

//getters
#[tauri::command]
fn get_layers(layers_mutex:State<Layers>) -> Vec<Vec<Vec<Object>>> {
  let layers = layers_mutex.0.lock().unwrap();
  return layers.to_vec();
}


#[tauri::command]
fn get_current_layer(layer_mutex:State<CurrentLayer>) -> usize {
  let layer = layer_mutex.0.lock().unwrap();
  return *layer;
}

fn main() {

  tauri::Builder::default()

    // .manage manages the state of the application.
    .manage(CurrentLayer(Default::default()))
    .manage(Layers(Default::default()))
    .manage(CurrentStroke(Default::default()))
    .manage(CurrentColor(Default::default()))
    .invoke_handler(tauri::generate_handler![
      create_color, 
      create_object,
      add_current_stroke,
      add_object_to_current_stroke,
      genorate_layers,
      get_layers,
      get_current_layer
      ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

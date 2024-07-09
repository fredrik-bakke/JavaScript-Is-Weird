use quick_js::{Context, JsValue};
use std::collections::HashMap;
use serde_json::Value as JsonValue;

fn main() {
    let max_length = 20; // Adjust as needed
    match search_programs(max_length) {
        Ok(results) => {
            for (result, program) in results {
                println!("{}: {}", result, program);
            }
        },
        Err(e) => println!("An error occurred: {}", e),
    }
}

fn search_programs(max_length: usize) -> Result<HashMap<String, String>, Box<dyn std::error::Error>> {
    let chars = "[]+-.,><";
    let mut results = HashMap::new();
    let context = Context::new()?;

    fn generate_programs(
        length: usize,
        current: String,
        chars: &str,
        context: &Context,
        results: &mut HashMap<String, String>,
    ) -> Result<(), Box<dyn std::error::Error>> {
        if length == 0 {
            match context.eval(&current) {
                Ok(value) => {
                    let json_value = js_value_to_json(value);
                    let result_str = json_value.to_string();
                    if !results.contains_key(&result_str) && !result_str.is_empty() {
                        println!("{} : {}", result_str, current);
                        results.insert(result_str, current);
                    }
                },
                Err(_) => {}, // Ignore evaluation errors
            }
            return Ok(());
        }

        for c in chars.chars() {
            generate_programs(length - 1, current.clone() + &c.to_string(), chars, context, results)?;
        }

        Ok(())
    }

    for i in 1..=max_length {
        println!("\nLength: {}", i);
        generate_programs(i, String::new(), chars, &context, &mut results)?;
    }

    Ok(results)
}

fn js_value_to_json(value: JsValue) -> JsonValue {
    match value {
        JsValue::Null => JsonValue::Null,
        JsValue::Undefined => JsonValue::Null, // JavaScript undefined is represented as null in JSON
        JsValue::Bool(b) => JsonValue::Bool(b),
        JsValue::Int(i) => JsonValue::Number(i.into()),
        JsValue::Float(f) => {
            // Handle NaN and Infinity
            if f.is_nan() {
                JsonValue::Null
            } else if f.is_infinite() {
                if f.is_sign_positive() {
                    JsonValue::String("Infinity".to_string())
                } else {
                    JsonValue::String("-Infinity".to_string())
                }
            } else {
                JsonValue::Number(serde_json::Number::from_f64(f).unwrap_or(0.into()))
            }
        },
        JsValue::String(s) => JsonValue::String(s),
        JsValue::Array(arr) => JsonValue::Array(arr.into_iter().map(js_value_to_json).collect()),
        JsValue::Object(obj) => {
            let mut map = serde_json::Map::new();
            for (k, v) in obj {
                map.insert(k, js_value_to_json(v));
            }
            JsonValue::Object(map)
        },
        _ => JsonValue::Null, // Handle other cases (like functions) as null
    }
}

use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  let migrations = vec![
    Migration {
      version: 1,
      description: "criar_tabela_animais",
      sql: "
      CREATE TABLE IF NOT EXISTS animais (
        id INTEGER PRIMARY KEY,
        brinco TEXT NOT NULL,
        sexo TEXT NOT NULL,
        raca TEXT NOT NULL,
        data_nascimento TEXT,
        peso REAL,
        data_entrada TEXT NOT NULL,
        origem TEXT,
        valor_compra REAL,
        status TEXT NOT NULL,
        data_saida TEXT,
        comprador TEXT,
        valor_venda REAL,
        data_morte TEXT,
        causa_morte text,
        observacoes text
      );
    ",
    kind: MigrationKind::Up,
  }
];
    tauri::Builder::default()
        .plugin(
          tauri_plugin_sql::Builder::default()
            .add_migrations("sqlite:rebanho.db", migrations)
            .build(),
        )
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while building tauri application");
}

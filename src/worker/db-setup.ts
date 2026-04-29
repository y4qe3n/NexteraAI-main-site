// db-setup.ts - Script to initialize database tables and seed data for NexaraAI Security

// This script would typically be run during deployment or development setup
// It creates necessary tables and seeds initial data for the application

// Note: This is a placeholder script. In a real Cloudflare Workers environment,
// you would use D1 database migrations or a similar mechanism.

async function setupDatabase(env: Env) {
  console.log('Setting up database tables and seeding data...');

  // Create users table if not exists
  await env.DB.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password_hash TEXT,
      notifications_enabled INTEGER DEFAULT 1,
      notification_frequency TEXT DEFAULT 'immediate',
      two_factor_enabled INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create organizations table if not exists
  await env.DB.exec(`
    CREATE TABLE IF NOT EXISTS organizations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // Create training_modules table if not exists
  await env.DB.exec(`
    CREATE TABLE IF NOT EXISTS training_modules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      duration INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create user_module_progress table if not exists
  await env.DB.exec(`
    CREATE TABLE IF NOT EXISTS user_module_progress (
      user_id INTEGER,
      module_id INTEGER,
      progress INTEGER DEFAULT 0,
      status TEXT DEFAULT 'not_started',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, module_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (module_id) REFERENCES training_modules(id)
    );
  `);

  // Seed default training modules if table is empty
  const moduleCount = await env.DB.prepare('SELECT COUNT(*) as count FROM training_modules').first<{ count: number }>();
  if ((moduleCount?.count ?? 0) === 0) {
    console.log('Seeding default training modules...');
    await env.DB.prepare(`
      INSERT INTO training_modules (title, description, duration)
      VALUES 
        ('Introduction to Cybersecurity', 'Learn the basics of protecting digital assets.', 1800),
        ('Phishing Prevention', 'Identify and avoid phishing attempts.', 1200),
        ('Password Management', 'Best practices for strong passwords and authentication.', 900),
        ('Data Privacy Essentials', 'Understand data protection regulations and practices.', 1500)
    `).run();
    console.log('Training modules seeded.');
  } else {
    console.log('Training modules already exist, skipping seeding.');
  }

  console.log('Database setup complete.');
}

// This function would be called during worker initialization or via a setup route
// For simplicity, it's not directly executable in this context but serves as a reference

export async function initializeDatabase(env: Env) {
  try {
    await setupDatabase(env);
    return { success: true, message: 'Database initialized successfully' };
  } catch (error) {
    console.error('Error initializing database:', error);
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, message: 'Failed to initialize database', error: message };
  }
}

// For direct execution during development (not in production worker context)
// This would need to be adapted based on your environment setup

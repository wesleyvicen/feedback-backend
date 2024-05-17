// knexfile.js
module.exports = {
    development: {
      client: 'mysql2',
      connection: {
        host: 'feedback.mysql.uhserver.com',
        user: 'user_feedback',
        password: 'Wer@99441494',
        database: 'feedback'
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: 'knex_migrations',
        directory: './data/migrations'
      },
      seeds: {
        directory: './data/seeds'
      }
    }
  };
  
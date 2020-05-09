module.exports = {
  PORT: parseInt(process.env.PORT) || 3000,
  SECRET: process.env.SECRET || 'local',
  DATABASE_URL: 'mongodb://localhost:27017/mestodb',
  NODE_ENV: 'production',
  JWT_SECRET: '0f3e08342f0a309b298b491a115d10bf9b86e4c2075ed04f583218d17de35120',
};

export default {
  jwt: {
    secret: process.env.APP_SECRET || 'defaul',
    expiresIn: '1d',
  },
};

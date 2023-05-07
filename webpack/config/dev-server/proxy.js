module.exports = {
  '/api/v*/**': {
    target: 'https://localhost:8000/',
    changeOrigin: true,
    secure: false,
  },
};

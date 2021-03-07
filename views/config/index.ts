const port = parseInt(process.env.PORT || '2000', 10);

const config = {
  port,
  backend_url:
    process.env.NODE_ENV === 'prod'
      ? `http://localhost:${port}`
      : 'https://closure.howlingmoon.dev',
};

export default config;

import Keyv from 'keyv';

const client = new Keyv(
  `redis://:${process.env.REDIS_PASSWORD}@localhost:6379`
);

client.on('error', (err) => {
  console.error('KeyV connection error');
  console.error(err);
});

export default client;

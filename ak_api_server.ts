import express from 'express';
import cors from 'cors';

import akApi from './backend/ak_api';

const server = express();

server.use(cors());

server.use('/api/ak', akApi);

server.listen(3001, () => {
  console.log(`Local server running at port 3001`);
});

import dotenv from 'dotenv';
import path from 'path';
import server from './app';

dotenv.config({ path: path.resolve(__dirname, '../../config.env') });

// Initialize the server
const port = process.env.PORT || 8000;
server.listen(port, () => {
	console.log(`Server running on port ${port}...`);
});

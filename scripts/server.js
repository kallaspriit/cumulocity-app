import express from 'express';
import path from 'path';

const port = 80;
const basePath = path.join(__dirname, '..', 'dist');

const app = express();

app.use('/gfx', express.static(path.join(basePath, 'gfx')));
app.use('/static', express.static(path.join(basePath, 'static')));

app.get('*', (req, res) => {
	res.sendFile(path.join(basePath, 'index.html'));
});

app.listen(port, () => {
	console.log(`server running on port ${port}`);
});

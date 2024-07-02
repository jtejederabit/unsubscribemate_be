const { processLink } = require('./unsubscribe');

module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('unsubscribe', async (links) => {
            if (!links || !Array.isArray(links)) {
                socket.emit('error', 'No links provided or invalid format');
                return;
            }

            for (const link of links) {
                try {
                    const result = await processLink(link);
                    socket.emit('progress', result);
                } catch (error) {
                    socket.emit('progress', { link, success: false, message: 'Error processing link' });
                }
            }
        });
    });
};

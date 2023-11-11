const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tour_booking', 'root', null, {
    host: 'localhost',
    dialect: 'mysql'
});

const connection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.log('Unable to connect to the database:', error);
    }
}

export default connection;
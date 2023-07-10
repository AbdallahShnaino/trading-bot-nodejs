const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/database');
const myEmitter = require('./../../utils/strategy.update.emitter')

const Strategy = sequelize.define('Strategy', {
  userId: {
    type: DataTypes.STRING,
    allawNull: false,
  },
  strategyData: {
    type: DataTypes.TEXT,
    allawNull: false,
  },
} ,  {
  tableName: 'Strategy',
  hooks : {
  /* 
  
      beforeCreate : (record, options) => {
          record.dataValues.createdAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/g, '');
          record.dataValues.updatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/g, '');
      },
  */
      afterUpdate : (record, options) => {
          record.dataValues.updatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/g, '');
          console.log('77777777777777777777777777777777777777777')
          myEmitter.emit('update' , record );
         
        }
  }
});



module.exports = Strategy;

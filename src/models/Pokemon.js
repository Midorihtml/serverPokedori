const { DataTypes, UUIDV4 } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('pokemon', {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true
      }
    },
    hp: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    attack: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    defense: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    speed: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    height: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    weight: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    image: {
      type: DataTypes.TEXT,
      isUrl: true,
      defaultValue: 'https://i0.wp.com/eltallerdehector.com/wp-content/uploads/2021/05/pikachu-clipart-png.png?resize=860%2C860&ssl=1'
    }
  },
    {
      timestamps: false
    });
};

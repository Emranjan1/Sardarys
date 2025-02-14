module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: { 
      type: DataTypes.TEXT,
      allowNull: true, 
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ageVerificationRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: true, 
      defaultValue: 0  
    }
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
  };

  return Product;
};

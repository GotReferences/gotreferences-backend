const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    quality_of_work: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timeliness: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    communication: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    professionalism: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    value_for_money: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    overall_rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reviewer_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    project_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    sentiment: {
      type: DataTypes.STRING,
      allowNull: true
    },
    positive_score: {
      type: DataTypes.DECIMAL(5,4),
      allowNull: true
    },
    negative_score: {
      type: DataTypes.DECIMAL(5,4),
      allowNull: true
    },
    neutral_score: {
      type: DataTypes.DECIMAL(5,4),
      allowNull: true
    },
    mixed_score: {
      type: DataTypes.DECIMAL(5,4),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  Review.beforeCreate((review) => {
    const { quality_of_work, timeliness, communication, professionalism, value_for_money } = review;
    review.overall_rating = ((quality_of_work * 0.4) + (timeliness * 0.2) + (communication * 0.15) + (professionalism * 0.15) + (value_for_money * 0.1)).toFixed(2);
  });

  return Review;
};

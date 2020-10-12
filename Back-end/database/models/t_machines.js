module.exports = function(sequelize, DataTypes) {
	return sequelize.define('t_machines', {
		machine_id: {
			type: DataTypes.TEXT,
			allowNull: false,
			primaryKey: true
		},
		machine_name: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		in_use: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		state: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		assigned_to: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	}, {
		sequelize,
		tableName: 't_machines',
		schema: 'public'
		});
};

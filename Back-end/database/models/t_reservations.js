/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('t_reservations', {
		reservation_id: {
			type: DataTypes.TEXT,
			allowNull: false,
			primaryKey: true
		},
		user_id: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		start_ts: {
			type: DataTypes.DATE,
			allowNull: true
		},
		end_ts: {
			type: DataTypes.DATE,
			allowNull: true
		},
		status: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	}, {
		sequelize,
		tableName: 't_reservations',
		schema: 'public'
		});
};

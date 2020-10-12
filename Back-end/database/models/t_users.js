/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('t_users', {
		user_id: {
			type: DataTypes.TEXT,
			allowNull: false,
			primaryKey: true
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		email_address: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		paperspace_email_address: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		verified_in_paperspace: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		paperspace_user_id: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		assigned_machine: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		reservations: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	}, {
		sequelize,
		tableName: 't_users',
		schema: 'public'
		});
};

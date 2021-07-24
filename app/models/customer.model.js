module.exports = (sequelize, Sequelize) => {
    const Customer = sequelize.define("customer", {
      first_name: {
        type: Sequelize.STRING
      },
      middle_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      birth_date: {
        type: Sequelize.DATE
      },
      id_number: {
        type: Sequelize.STRING
      },
      id_issue_date: {
        type: Sequelize.DATE
      },
      id_expire_date: {
        type: Sequelize.DATE
      },
    });
  
    return Customer;
  };
  
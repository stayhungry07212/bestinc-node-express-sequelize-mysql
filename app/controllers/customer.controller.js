const db = require("../models");
const Customer = db.customers;
const Op = db.Sequelize.Op;

// Create and Save a new Customer
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.id_number) {
    res.status(400).send({
      message: "id number can not be empty!"
    });
    return;
  }

  const old_customer = await Customer.findOne({ where: { id_number: req.body.id_number } });
  if (old_customer) {
    res.status(400).send({
      message: "id number duplicated!"
    });
    return;
  }

  // Create a Customer
  const customer = {
    first_name: req.body.first_name,
    middle_name: req.body.middle_name,
    last_name: req.body.last_name,
    birth_date: req.body.birth_date,
    id_number: req.body.id_number,
    id_issue_date: req.body.id_issue_date,
    id_expire_date: req.body.id_expire_date,
  };

  // Save Customer in the database
  Customer.create(customer)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the customer."
      });
    });
};

// Retrieve all Customers from the database.
exports.findAll = (req, res) => {
  const searchName = req.query.name;
  const condition = (searchName)
    ? {
      [Op.or]: [
        { first_name: { [Op.like]: `%${searchName}%` } },
        { middle_name: { [Op.like]: `%${searchName}%` } },
        { last_name: { [Op.like]: `%${searchName}%` } },
      ]
    } : null;

  Customer.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customers."
      });
    });
};

// Find a single Customer with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Customer.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Customer with id=" + id
      });
    });
};

// Update a Customer by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Customer.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Customer was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Customer with id=${id}. Maybe Customer was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Customer with id=" + id
      });
    });
};

// Delete a Customer with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Customer.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Customer was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Customer with id=${id}. Maybe Customer was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Customer with id=" + id
      });
    });
};

// Delete all Customers from the database.
exports.deleteAll = (req, res) => {
  Customer.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Customers were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all customers."
      });
    });
};

// find all published Customer
exports.findAllPublished = (req, res) => {
  Customer.findAll({ where: { published: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customers."
      });
    });
};

// Validate a ID card with third party REST API
exports.validateId = (req, res) => {
  // Validate request
  if (!req.body.ImageBase64) {
    res.status(400).send({
      message: "ImageBase64 can not be empty!"
    });
    return;
  }

  const fetch = require('node-fetch');

  let payload = {
    ImageBase64: req.body.ImageBase64,
    BarcodeType: 'Pdf417',
  };

  fetch('https://bestbillpay.net:8443/barcode/dl', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
  }).then(res => res.text())
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while validating ID card"
      });
    });
};

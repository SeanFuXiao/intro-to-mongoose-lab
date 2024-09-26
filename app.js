const prompt = require("prompt-sync")();

// const username = prompt("What is your name? ");

// console.log(`Your name is ${username}`);
const express = require("express");

const app = express();
const Customer = require("./models/Customer");

const mongoose = require("mongoose");

require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected ${mongoose.connection.name}.`);
});

//========================================================
//welcom()
//========================================================

async function welcome() {
  let run = true;

  while (run) {
    console.log();
    console.log();
    console.log("Welcome to the CRM");
    console.log();
    console.log("1. Create a customer");
    console.log("2. View all customers");
    console.log("3. Update a customer");
    console.log("4. Delete a customer");
    console.log("5. Quit");
    console.log();
    console.log();

    const choice = prompt("Number of action to run: ");

    switch (choice) {
      case "1":
        await createCustomer();
        break;
      case "2":
        await viewCustomers();
        break;
      case "3":
        await updateCustomer();
        break;
      case "4":
        await deleteCustomer();
        break;
      case "5":
        console.log("Exiting...");
        mongoose.connection.close();
        run = false;
        break;
      default:
        console.log("Invalid, please choice again.");
    }
  }
}

welcome();

//========================================================
//createCustomer()
//========================================================

async function createCustomer() {
  const name = prompt("What is the customers name?");
  const age = parseInt(prompt("What is the customers new age?"));

  if (isNaN(age)) {
    console.log("Invalid age, please enter a number.");
    return;
  }

  const customer = new Customer({ name, age });
  await customer.save();
  console.log();
  console.log(`Customer created successfully! ID: ${customer._id}`);
  console.log();
}

//========================================================
//viewCustomers()
//========================================================

async function viewCustomers() {
  const customers = await Customer.find();

  if (customers.length === 0) {
    console.log("No customers found.");
    return;
  }
  console.log();
  console.log("Below is a list of customers:");
  console.log();
  customers.forEach((customer) => {
    console.log(
      `ID: ${customer._id} - Name: ${customer.name}, Age: ${customer.age}`
    );
  });
}

//========================================================
//updateCustomer()
//========================================================

async function updateCustomer() {
  const customers = await Customer.find();
  if (customers.length === 0) {
    console.log("No customers available to update.");
    return;
  }
  console.log();
  console.log("Below is a list of customers:");
  console.log();

  customers.forEach((customer) => {
    console.log(
      `ID: ${customer._id} - Name: ${customer.name}, Age: ${customer.age}`
    );
  });

  const id = prompt(
    "Copy and paste the id of the customer you would like to update here: "
  );
  const newName = prompt("What is the customers new name?");
  const newAge = parseInt(prompt("What is the customers new age? "));

  if (isNaN(newAge)) {
    console.log("Invalid age, please enter a number.");
    return;
  }

  await Customer.findByIdAndUpdate(id, { name: newName, age: newAge });
  console.log(`Customer with ID ${id} updated successfully!`);
}

//========================================================
//deleteCustomer()
//========================================================
async function deleteCustomer() {
  const customers = await Customer.find();
  if (customers.length === 0) {
    console.log("No customers available to delete.");
    return;
  }
  console.log();
  console.log("Below is a list of customers:");
  console.log();

  customers.forEach((customer) => {
    console.log(
      `ID: ${customer._id} - Name: ${customer.name}, Age: ${customer.age}`
    );
  });

  const id = prompt(
    "Copy and paste the id of the customer you would like to delete here: "
  );
  await Customer.findByIdAndDelete(id);
  console.log(`Customer with ID ${id} deleted successfully!`);
}

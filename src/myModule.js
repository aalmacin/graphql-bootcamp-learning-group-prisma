const message = "Some message from myModule.js";
const name = "Aldrin";
const location = "Barrie";

const getGreeting = (name) => {
  return `Welcome ${name}`;
};
export { message, name, getGreeting, location as default };

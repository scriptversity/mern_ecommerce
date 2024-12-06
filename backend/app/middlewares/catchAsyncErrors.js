// module.exports = (func) => {
//   return (req, res, next) => {
//     func(req, res, next).catch(next);
//   };
// };

// module.exports = (func) => (req, res, next) => 
//   Promise.resolve(func(req, res, next)).catch(next);

module.exports = function (func) {
  return function (req, res, next) {
    Promise.resolve(func(req, res, next)).catch(next);
  };
};

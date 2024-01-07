// The asyncHandler function takes an asynchronous function (fn) as an argument.
const asyncHandler = (fn) => (req, res, next) => {
  // It returns a new function that takes the standard Express parameters (req, res, next).
  // The function returned by asyncHandler wraps the asynchronous function (fn) inside a Promise.
  Promise.resolve(fn(req, res, next)).catch((err) => {
    // If there is an error during the execution of the asynchronous function,
    //  and the response is sent with a 500 Internal Server Error status and error message
    res.status(500).json({ message: err.message });
  });
};

export default asyncHandler;

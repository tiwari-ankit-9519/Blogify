export const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error:", err);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal Server Error";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  if (err.code === "P2002") {
    statusCode = 400;
    message = "Duplicate field value. Please use a different value.";
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Authorization denied.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired. Please login again.";
  }

  res.status(statusCode).json({ success: false, message });
};

export const notFound = (req, res, next) => {
  const error = new Error(`🔍 Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

const checkHealth = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse (200, {}, "health check route")
    )
})

module.exports =  {
    checkHealth
}
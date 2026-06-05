const asyncHandler = require('../../utils/asyncHandler'); 
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');
const Product = require('../../models/product');


const getAllProducts = asyncHandler(async (req, res) => {
   const { category, subcategory, city, isAvailableForRent } = req.query;
   let filter = {};
   if (category) {
       filter.category = category;
   }
   if (subcategory) {
       filter.subcategory = subcategory;
   }
   if (city) {
       filter.city = city;
   }
   if (isAvailableForRent) {
       filter.isAvailableForRent = isAvailableForRent === 'true'; // Convert string to boolean    
   }
   const products = await Product.find(filter);
   if (!products.length) {
    throw new ApiError(404, 'No products found');
  } 
  return res.status(200).json(
    new ApiResponse(200, products, 'Products retrieved successfully')
  );
});

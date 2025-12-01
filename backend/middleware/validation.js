/**
 * Request Validation Middleware
 */
export const validateSale = (req, res, next) => {
  const { cartItems } = req.body;

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart items must be a non-empty array' });
  }

  for (const item of cartItems) {
    if (!item.itemId || !item.quantity || item.quantity <= 0) {
      return res.status(400).json({ 
        error: 'Each cart item must have itemId and positive quantity' 
      });
    }
  }

  next();
};

export const validateRental = (req, res, next) => {
  const { phoneNumber, rentalId } = req.body;

  if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
    return res.status(400).json({ error: 'Valid 10-digit phone number required' });
  }

  if (!rentalId) {
    return res.status(400).json({ error: 'Rental ID required' });
  }

  next();
};

export default {
  validateSale,
  validateRental
};

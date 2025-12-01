/**
 * InventoryService - Business logic for inventory management
 * Refactored from Java Inventory class (Singleton pattern removed)
 * MySQL implementation
 * Eliminates: God Class, Duplicate Code, Magic Numbers, Hard-coded Paths
 */
class InventoryService {
  constructor(itemRepo) {
    this.itemRepo = itemRepo;
    this.LOW_STOCK_THRESHOLD = parseInt(process.env.LOW_STOCK_THRESHOLD) || 10;
    this.CRITICAL_STOCK_THRESHOLD = parseInt(process.env.CRITICAL_STOCK_THRESHOLD) || 5;
  }

  /**
   * Get all items from inventory
   * Replaces Inventory.accessInventory() from Java
   */
  async getAllItems() {
    return await this.itemRepo.findAll();
  }



  /**
   * Get single item by ID
   */
  async getItemById(itemId) {
    const item = await this.itemRepo.findById(itemId);
    if (!item) {
      throw new Error(`Item ${itemId} not found`);
    }
    return item;
  }



  /**
   * Add new item to inventory
   * Replaces EnterItem_Interface logic from Java
   */
  async addItem(itemData) {
    const { name, price, quantity, category } = itemData;

    if (!name || name.trim().length === 0) {
      throw new Error('Item name is required');
    }

    if (price === null || price === undefined || price < 0) {
      throw new Error('Valid price is required');
    }

    if (quantity === null || quantity === undefined || quantity < 0) {
      throw new Error('Valid quantity is required');
    }

    return await this.itemRepo.create({
      name: name.trim(),
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category: category || 'General'
    });
  }



  /**
   * Update item information
   * Replaces UpdateEmployee_Interface pattern from Java
   */
  async updateItem(itemId, updates) {
    const item = await this.itemRepo.findById(itemId);
    if (!item) {
      throw new Error(`Item ${itemId} not found`);
    }

    const updateData = {};
    if (updates.name !== undefined) updateData.name = updates.name.trim();
    if (updates.price !== undefined) {
      if (updates.price < 0) throw new Error('Price cannot be negative');
      updateData.price = parseFloat(updates.price);
    }
    if (updates.quantity !== undefined) {
      if (updates.quantity < 0) throw new Error('Quantity cannot be negative');
      updateData.quantity = parseInt(updates.quantity);
    }
    if (updates.category !== undefined) updateData.category = updates.category;

    return await this.itemRepo.update(itemId, updateData);
  }



  /**
   * Adjust item quantity (for sales/returns)
   * Replaces Inventory.updateInventory() from Java
   * Eliminates duplicate file I/O code
   */
  async adjustItemQuantity(itemId, quantityChange) {
    const item = await this.itemRepo.findById(itemId);
    if (!item) {
      throw new Error(`Item ${itemId} not found`);
    }

    const newQuantity = item.quantity + quantityChange;
    if (newQuantity < 0) {
      throw new Error(`Insufficient stock for item ${itemId}`);
    }

    return await this.itemRepo.updateQuantity(itemId, quantityChange);
  }



  /**
   * Get low stock items
   * Eliminates magic number smell
   */
  async getLowStockItems(threshold = null) {
    const stockThreshold = threshold || this.LOW_STOCK_THRESHOLD;
    const items = await this.itemRepo.findAll();
    return items.filter(item => item.quantity > 0 && item.quantity <= stockThreshold);
  }

  /**
   * Get critical stock items
   */
  async getCriticalStockItems() {
    const items = await this.itemRepo.findAll();
    return items.filter(item => item.quantity > 0 && item.quantity <= this.CRITICAL_STOCK_THRESHOLD);
  }

  /**
   * Get out of stock items
   */
  async getOutOfStockItems() {
    const items = await this.itemRepo.findAll();
    return items.filter(item => item.quantity === 0);
  }

  /**
   * Check if item is in stock
   */
  async isItemInStock(itemId, requiredQuantity = 1) {
    const item = await this.itemRepo.findById(itemId);
    return item && item.quantity >= requiredQuantity;
  }

  /**
   * Get inventory statistics
   */
  async getInventoryStats() {
    const items = await this.itemRepo.findAll();

    return {
      totalItems: items.length,
      lowStockItems: items.filter(i => i.quantity > 0 && i.quantity <= this.LOW_STOCK_THRESHOLD).length,
      outOfStockItems: items.filter(i => i.quantity === 0).length,
      totalItemValue: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
  }

  /**
   * Update item quantity
   */
  async updateItemQuantity(itemId, quantity) {
    const item = await this.itemRepo.findById(itemId);
    if (!item) {
      throw new Error(`Item ${itemId} not found`);
    }

    return await this.itemRepo.update(itemId, { quantity: parseInt(quantity) });
  }
}

export default InventoryService;

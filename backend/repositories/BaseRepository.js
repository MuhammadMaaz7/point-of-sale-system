/**
 * BaseRepository - Abstract repository pattern implementation
 * Provides common CRUD operations for all repositories
 * MySQL implementation with connection pool
 */
class BaseRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async findAll(conditions = {}) {
    // Override in child classes
    throw new Error('findAll must be implemented');
  }

  async findById(id) {
    // Override in child classes
    throw new Error('findById must be implemented');
  }

  async create(data) {
    // Override in child classes
    throw new Error('create must be implemented');
  }

  async update(id, data) {
    // Override in child classes
    throw new Error('update must be implemented');
  }

  async delete(id) {
    // Override in child classes
    throw new Error('delete must be implemented');
  }
}

export default BaseRepository;

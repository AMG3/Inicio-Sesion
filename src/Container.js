export class Container {
  constructor(knexConfig, tableName) {
    this.knexConfig = knexConfig;
    this.tableName = tableName;
    this.id = "id";
  }

  async save(element) {
    try {
      const newProductId = await this.knexConfig
        .insert(element)
        .from(this.tableName);
      console.log(`Producto agregado con ID: ${newProductId}.`);
      return newProductId;
    } catch (error) {
      console.error(error);
    }
  }

  async getById(id) {
    try {
      return await this.knexConfig
        .select()
        .from(this.tableName)
        .where(this.id, id);
    } catch (error) {
      console.error("Producto no encontrado");
    }
  }

  async getAll() {
    try {
      return await this.knexConfig.select().from(this.tableName);
    } catch (error) {
      console.error(error);
    }
  }

  async deleteById(id) {
    try {
      await this.knexConfig.del().from(this.tableName).where(this.id, id);
      console.log("Producto eliminado.");
      return true;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteAll() {
    try {
      return await this.knexConfig.select().from(this.tableName);
    } catch (error) {
      console.error(error);
    }
  }

  async updateById(element, id) {
    try {
      await this.knexConfig
        .from(this.tableName)
        .update(element)
        .where(this.id, id);
      return true;
    } catch (error) {
      console.error(error);
    }
  }
}

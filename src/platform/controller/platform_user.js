const Base = require('./base.js')
const MODEL_NAME = 'platform_user'
const MODEL_CFG = { type: 'platform' }
const MODEL_MODULE = 'platform'
module.exports = class extends Base {
  // static get _REST() {
  //   return true;
  // }
  constructor(ctx) {
    super(ctx)
    this.platform_user = this.model(MODEL_NAME, MODEL_CFG, MODEL_MODULE)
  }
  async indexAction() {
    const data = await this.platform_user
      .where({
        
      })
      .page(0, 10)
      .countSelect()
    this.success(data)
  }

  async apiAction() {
    switch (this.method) {
      case 'GET':
        await this._get()
        break
      case 'POST':
        await this._create()
        break
      case 'PUT':
      case 'PATCH':
        await this._update()
        break
      case 'DELETE':
        await this._delete()
        break
      default:
        get()
    }
  }
  /**
  * 恢复已删除的用户 
  */
  async recoverAction() {
    const id = this.get('id')
    if (!id) {
      return this.fail('params error')
    }
    const pk = this.platform_user.pk
    const data = {
      status: 0, // 从删除状态恢复之后，状态变为未激活。
      block: 0,
      block_reason: '',
      deleted_at: null
    }
    const rows = await this.platform_user.where({ [pk]: id }).update(data)
    return this.success({ affectedRows: rows })
  }

  async _get() {
    const id = this.get('id')
    const pk = this.platform_user.pk
    if (id) {
      const data = await this.platform_user.where({ [pk]: id }).find()
      return this.success(data)
    } else {
      return this.fail('no data')
    }
  }

  async _create() {
    const pk = this.platform_user.pk
    const data = this.post()
    delete data[pk]
    data['created_at'] = new Date().toISOString()
    if (think.isEmpty(data)) {
      return this.fail('data is empty')
    }
    const insertId = await this.platform_user.add(data)
    return this.success({ id: insertId })
  }

  async _update() {
    const id = this.get('id')
    if (!id) {
      return this.fail('params error')
    }
    const pk = this.platform_user.pk
    const data = this.post()
    data[pk] = this.id // rewrite data[pk] forbidden data[pk] !== this.id
    data['updated_at'] = new Date().toISOString()
    if (think.isEmpty(data)) {
      return this.fail('data is empty')
    }
    const rows = await this.platform_user.where({ [pk]: id }).update(data)
    return this.success({ affectedRows: rows })
  }
  /**
   * _delete()
   * 删除用户，逻辑删除。
   */
  async _delete() {
    const id = this.get('id')
    if (!id) {
      return this.fail('params error d')
    }
    const data = {
      deleted_at: new Date().toISOString(),
      status: 9, // 已删除
      block: 1, // 锁定
      block_reason: '删除用户'
    }
    const pk = this.platform_user.pk
    const rows = await this.platform_user.where({ [pk]: id }).update(data)
    return this.success({ affectedRows: rows })
  }
}

import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PgDataSource} from '../datasources';
import {Item, ItemRelations} from '../models';

export class ItemRepository extends DefaultCrudRepository<
  Item,
  typeof Item.prototype.id,
  ItemRelations
> {
  constructor(@inject('datasources.pg') dataSource: PgDataSource) {
    super(Item, dataSource);
  }
}

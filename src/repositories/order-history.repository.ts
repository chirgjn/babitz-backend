import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PgDataSource} from '../datasources';
import {OrderHistory, OrderHistoryRelations} from '../models';

export class OrderHistoryRepository extends DefaultCrudRepository<
  OrderHistory,
  typeof OrderHistory.prototype.id,
  OrderHistoryRelations
> {
  constructor(@inject('datasources.pg') dataSource: PgDataSource) {
    super(OrderHistory, dataSource);
  }
}

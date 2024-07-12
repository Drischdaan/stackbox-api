import { faker } from '@faker-js/faker';
import { EntityBase } from '@stackbox/database';
import { ProductEntity } from '@stackbox/products/entities/product.entity';
import { WorkspaceEntity } from '@stackbox/workspaces/entities/workspace.entity';
import * as Factory from 'factory.ts';

export class TestEntity extends EntityBase {
  name: string;
  description: string;
}

const Test = Factory.Sync.makeFactory<TestEntity>({
  id: Factory.each(() => faker.string.uuid()),
  createdAt: Factory.each(() => faker.date.recent()),
  updatedAt: Factory.each(() => faker.date.recent()),
  name: Factory.each(() => faker.internet.displayName()),
  description: Factory.each(() => faker.string.sample()),
});

const Workspace = Factory.Sync.makeFactory<WorkspaceEntity>({
  id: Factory.each(() => faker.string.uuid()),
  createdAt: Factory.each(() => faker.date.recent()),
  updatedAt: Factory.each(() => faker.date.recent()),
  name: Factory.each(() => faker.internet.displayName()),
  description: Factory.each(() => faker.string.sample()),
  logoUrl: Factory.each(() => faker.image.url()),
});

const Product = Factory.Sync.makeFactory<ProductEntity>({
  id: Factory.each(() => faker.string.uuid()),
  createdAt: Factory.each(() => faker.date.recent()),
  updatedAt: Factory.each(() => faker.date.recent()),
  name: Factory.each(() => faker.internet.displayName()),
  description: Factory.each(() => faker.string.sample()),
  logoUrl: Factory.each(() => faker.image.url()),
  workspaceId: Factory.each(() => faker.string.uuid()),
  workspace: Factory.each(() => Workspace.build()),
});

export const TestDataFactory = {
  Test,
  Workspace,
  Product,
};

import { faker } from '@faker-js/faker';
import { IWorkspaceEntity } from '@stackbox/workspaces';
import * as Factory from 'factory.ts';

const Workspace = Factory.Sync.makeFactory<IWorkspaceEntity>({
  id: Factory.each(() => faker.string.uuid()),
  name: Factory.each(() => faker.internet.displayName()),
  description: Factory.each(() => faker.string.sample()),
  createdAt: Factory.each(() => faker.date.recent()),
  updatedAt: Factory.each(() => faker.date.recent()),
});

export const TestDataFactory = {
  Workspace,
};

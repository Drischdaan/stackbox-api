import { TestBed } from '@automock/jest';
import { AppController, PingResponse } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const { unit } = TestBed.create(AppController).compile();

    appController = unit;
  });

  describe('root', () => {
    it('should return ping', () => {
      const expected: PingResponse = { ping: 'pong' };
      expect(appController.getPing()).toEqual(expected);
    });
  });
});

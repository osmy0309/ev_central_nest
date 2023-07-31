import { Test, TestingModule } from '@nestjs/testing';
import { UserseederService } from './userseeder.service';

describe('UserseederService', () => {
  let service: UserseederService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserseederService],
    }).compile();

    service = module.get<UserseederService>(UserseederService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

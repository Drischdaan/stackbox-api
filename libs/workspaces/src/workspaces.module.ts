import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceEntity } from './entities/workspace.entity';
import { WorkspacesService } from './services/workspaces.service';
import { WorkspacesController } from './controllers/workspaces.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity])],
  providers: [WorkspacesService],
  exports: [WorkspacesService],
  controllers: [WorkspacesController],
})
export class WorkspacesModule {}

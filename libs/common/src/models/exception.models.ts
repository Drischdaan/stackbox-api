import { ApiProperty } from '@nestjs/swagger';

export class ExceptionResult {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  error: string;

  @ApiProperty()
  message: string;
}

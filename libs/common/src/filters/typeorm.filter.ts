import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DatabaseError } from 'pg';
import { QueryFailedError } from 'typeorm';
import { ExceptionResult } from '../models/exception.models';

export enum PostgresErrorCodes {
  NullValueNotAllowed = '22004',
  ForeignKeyViolation = '23503',
  UniqueViolation = '23505',
}

type ExceptionResultProvider = (error: DatabaseError) => ExceptionResult;

function getKeyFromDetails(error: DatabaseError): string {
  if (!error.detail.startsWith('Key (')) return 'unknownKeyName';
  return error.detail.split('Key (')[1].split(')')[0];
}

function getNameFromTable(error: DatabaseError): string {
  return (
    error.table.charAt(0).toUpperCase() +
    error.table.slice(1, error.table.length - 1)
  );
}

const MappedPostgresErrorCodes: Record<
  PostgresErrorCodes,
  ExceptionResultProvider
> = {
  [PostgresErrorCodes.NullValueNotAllowed]: (error: DatabaseError) => ({
    statusCode: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: `The value of '${getKeyFromDetails(error)}' cannot be null`,
  }),
  [PostgresErrorCodes.ForeignKeyViolation]: (error: DatabaseError) => ({
    statusCode: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: `The value of '${getKeyFromDetails(error)}' is invalid`,
  }),
  [PostgresErrorCodes.UniqueViolation]: (error: DatabaseError) => ({
    statusCode: HttpStatus.CONFLICT,
    error: 'Bad Request',
    message: `There is already a ${getNameFromTable(error)} with the same ${getKeyFromDetails(error)}`,
  }),
};

@Catch(QueryFailedError)
export class TypeormFilter implements ExceptionFilter {
  catch(exception: QueryFailedError<DatabaseError>, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse<Response>();
    const code: PostgresErrorCodes = exception.driverError
      .code as PostgresErrorCodes;
    const result: ExceptionResult = MappedPostgresErrorCodes[code](
      exception.driverError,
    );
    response.status(result.statusCode).json(result);
  }
}

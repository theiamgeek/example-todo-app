import { DataResult } from '@epandco/unthink-foundation';

type ServiceResult = object | string | number | boolean | void;

export class NotAvailable { }
export class ServiceError {
  constructor(
    public readonly type: string,
    public readonly message: string
  ) {}
}

export async function serviceWrapper(fn:  () => Promise<ServiceResult>): Promise<DataResult> {
  try {
    const result = await fn();

    if (result) {
      return DataResult.ok(result);
    }

    return DataResult.noResult();
  } catch (error) {
    if (error instanceof NotAvailable) {
      return DataResult.notFound();
    }

    if (error instanceof ServiceError) {
      return DataResult.error(error);
    }

    throw error;
  }
}
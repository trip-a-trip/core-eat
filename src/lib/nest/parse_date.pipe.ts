import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform<string, Date> {
  transform(value: string, metadata: ArgumentMetadata): Date {
    const val = new Date(value);
    if (Number.isNaN(val.valueOf())) {
      throw new BadRequestException('Expect date');
    }
    return val;
  }
}

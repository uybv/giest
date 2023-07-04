import { Pipe, PipeTransform } from '@angular/core';
import { VALUES, ValueType } from '@gi/core/common';

@Pipe({
  name: 'valueName'
})
export class ValueNamePipe implements PipeTransform {

  transform(value: ValueType): unknown {
    return VALUES[value] ?? null;
  }

}

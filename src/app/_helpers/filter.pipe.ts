import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], search: any): any[] {
    if (!items) return [];
    if (!search.text) return items;

    const variable = search.variable;
    const searchText = search.text.toLowerCase();
    return items.filter(it => {
      return it[variable].toLowerCase().includes(searchText);
    });
  }
}

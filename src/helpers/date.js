import formatDate from 'date-fns/format';
import fr from 'date-fns/locale/fr';

export function format(date, format = 'd MMMM yyyy') {
  return formatDate(date, format, { locale: fr });
}

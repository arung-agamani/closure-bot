export function faction(data: string) {
  switch (data) {
    case 'logo_rhodes':
      return 'Rhodes Island';
    case 'logo_lungmen':
      return 'Lungmen Guard Department';
    case 'logo_penguin':
      return 'Penguin Logistics';
    case 'logo_blacksteel':
      return 'Blacksteel';
    case 'logo_rhine':
      return 'Rhine Lab';
    case 'logo_victoria':
      return 'Victoria';
    case 'logo_ursus':
      return 'Ursus';
    case 'logo_kazimierz':
      return 'Kazimierz Knights';
    case 'logo_babel':
      return 'Babel';
    case 'logo_Leithanien':
      return 'Leithanien';
    case 'logo_Laterano':
      return 'Laterano';
    case 'logo_kjerag':
      return 'Kjerag';
    case 'logo_rim':
      return 'Rim Billiton';
    case 'logo_abyssal':
      return 'Abyssal Hunters';
    case 'logo_yan':
      return 'Yan';
    case 'logo_siesta':
      return 'Siesta';
    case 'logo_sargon':
      return 'Sargon';
    default:
      return 'No Data';
  }
}

export default null;

import DATA from '../../mock/dvhc.json';

const onGetDistrictName = (idDistrict: string | undefined | null): string => {
  if(!idDistrict) return '';
  return DATA.level2s.find(r => r.level2_id === idDistrict)?.name ?? '';
}

const onGetWardName = (idDistrict: string | undefined | null, idWard: string | undefined | null): string => {
  if(!(idDistrict || idWard)) return '';
  const district = DATA.level2s.find(r => r.level2_id === idDistrict);
  if(!district) return '';
  return district.level3s.find(r => r.level3_id === idWard)?.name ?? '';
}

export { onGetDistrictName, onGetWardName };
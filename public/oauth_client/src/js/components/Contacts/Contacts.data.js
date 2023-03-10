
const types = {
  FAVORITES: 'favorites',
  SPONSOR: 'sponsor',
  CLIENT: 'client',
  CONSULTANT: 'consultant',
  FAITH: 'faith',
  COMMUNITY: 'community',
}

const { FAVORITES, SPONSOR, CLIENT, CONSULTANT, FAITH, COMMUNITY } = types;

const contact_data = {}
contact_data[FAVORITES] = { text: FAVORITES, icon: 'bookmark2', label: 'favorites' };
contact_data[SPONSOR] = { text: SPONSOR, icon: 'user', label: 'show sponsor' };
contact_data[CLIENT] = { text: CLIENT, icon: 'address-book', label: 'clients' };
contact_data[CONSULTANT] = { text: CONSULTANT, icon: 'users', label: 'crisis consultants' };
contact_data[FAITH] = { text: FAITH, icon: 'flame-icon', label: 'faith leaders' };
contact_data[COMMUNITY] = { text: COMMUNITY, icon: 'office', label: 'community advocates' };

module.exports = {
  types,
  contact_data
}
export const navLinks = [
  { label: 'Wedding favours', href: '/wedding-favours' },
  { label: 'Corporate gifts', href: '/corporate-gifts' },
  { label: 'Packaging', href: '/packaging' },
  { label: 'Gallery', href: '/gallery' },
];

export type ShowcaseItem = {
  name: string;
  material: string;
  category: string;
  image: string;
};

export const showcaseItems: ShowcaseItem[] = [
  { name: 'Pure copper water tumbler', material: 'Copper', category: 'Drinkware', image: '/Pure Copper Water Tumbler.png' },
  { name: 'Hammered copper Moscow mule mug', material: 'Copper', category: 'Drinkware', image: '/Hammered Copper Moscow Mule Mug.png' },
  { name: 'Mini copper lota pot', material: 'Copper', category: 'Decor', image: '/Mini_Copper_Lota_Pot.png' },
  { name: 'Copper teaspoon gift set', material: 'Copper', category: 'Serveware', image: '/Copper_Teaspoon_Gift_Set.png' },
  { name: 'Copper napkin ring', material: 'Copper', category: 'Serveware', image: '/Copper_Napkin_Ring.png' },
  { name: 'Copper keychain', material: 'Copper', category: 'Accessories', image: '/Copper_Keychain.png' },
  { name: 'Copper incense holder', material: 'Copper', category: 'Decor', image: '/Copper_Incense_Holder.png' },
  { name: 'Copper bookmark', material: 'Copper', category: 'Accessories', image: '/Copper_Bookmark.png' },
  { name: 'Copper tea light holder', material: 'Copper', category: 'Decor', image: '/Copper Tea Light Holder.png' },
  { name: 'Mini brass diya oil lamp', material: 'Brass', category: 'Decor', image: '/Mini_Brass_Diya_Oil_Lamp.png' },
  { name: 'Lotus brass tealight holder', material: 'Brass', category: 'Decor', image: '/Lotus_Brass_Tealight_Holder.png' },
  { name: 'Peacock brass diya lamp', material: 'Brass', category: 'Decor', image: '/Peacock_Brass_Diya_Lamp.png' },
  { name: 'Brass temple bell', material: 'Brass', category: 'Decor', image: '/Brass_Temple_Bell.png' },
  { name: 'Brass Ganesha mini statue', material: 'Brass', category: 'Decor', image: '/Brass_Ganesha_Mini_Statue.png' },
  { name: 'Brass elephant figurine', material: 'Brass', category: 'Decor', image: '/Brass_Elephant_Figurine.png' },
  { name: 'Brass incense holder', material: 'Brass', category: 'Decor', image: '/Brass_Incense_Holder.png' },
  { name: 'Brass spice spoon', material: 'Brass', category: 'Serveware', image: '/Brass_Spice_Spoon.png' },
  { name: 'Brass bookmark', material: 'Brass', category: 'Accessories', image: '/Brass_Bookmark.png' },
  { name: 'Brass trinket box', material: 'Brass', category: 'Accessories', image: '/Brass_Trinket_Box.png' },
  { name: 'Taj marble coaster set', material: 'Marble', category: 'Serveware', image: '/Taj_Marble_Coaster_Set.png' },
  { name: 'Marble candle holder', material: 'Marble', category: 'Decor', image: '/Marble_Candle_Holder.png' },
  { name: 'Marble elephant figurine', material: 'Marble', category: 'Decor', image: '/Marble_Elephant_Figurine.png' },
  { name: 'Marble jewellery dish', material: 'Marble', category: 'Accessories', image: '/Marble_Jewellery_Dish.png' },
  { name: 'Marble incense holder', material: 'Marble', category: 'Decor', image: '/Marble_Incense_Holder.png' },
  { name: 'Marble Taj Mahal paperweight', material: 'Marble', category: 'Accessories', image: '/Marble_Taj_Mahal_Paperweight.png' },
  { name: 'Marble tealight holder', material: 'Marble', category: 'Decor', image: '/Marble_Tealight_Holder.png' },
  { name: 'Marble soap dish', material: 'Marble', category: 'Decor', image: '/Marble_Soap_Dish.png' },
  { name: 'Marble ring holder', material: 'Marble', category: 'Accessories', image: '/Marble_Ring_Holder.png' },
  { name: 'Marble spice bowl', material: 'Marble', category: 'Serveware', image: '/Marble_Spice_Bowl.png' },
];

export function pickItems(names: string[]) {
  return names
    .map((name) => showcaseItems.find((item) => item.name === name))
    .filter((item): item is ShowcaseItem => Boolean(item));
}


module.exports = client => {
  if(!client) throw new Error('No Discord Client given');

  // const inventoryProvider = new EnmapLevel({name: 'inventory'}); 

  // client._inventories = new Enmap({provider: inventoryProvider});
  client._util.getInventory = (userID) => {
    const inventory = client._inventories.get(userID);
    return inventory;
  }
  client._util.setInventory = (userID, items) => {
    const inventory = client._inventories.get(userID) || {items: []};
    inventory.items.push(items);
    client._inventories.set(userID, inventory)
  }
}
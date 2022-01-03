export function pluralize(name, count) {
  if (count === 1) {
    return name;
  }
  return name + 's';
}

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('shop-shop', 1);
    let db, tx, store;
    request.onupgradeneeded = function (e) {
      const db = request.result;

      db.createObjectStore('products', { keyPath: '_id' });
      db.createObjectStore('categories', { keyPath: '_id' });
      db.createObjectStore('cart', { keyPath: '_id' });
    };

    request.onerror = function (e) {
      console.error('There was an error!');
    };

    request.onsuccess = function (e) {
      db = request.result;
      tx = db.transaction(storeName, 'readwrite');
      store = tx.objectStore(storeName);
      db.onerror = function (e) {
        console.error('There was an error!', e);
      };

      switch (method) {
        case 'get':
          const all = store.getAll();
          all.onsuccess = function () {
            resolve(all.result);
          };
          break;
        case 'put':
          store.put(object);
          resolve(object);
          break;
        case 'add':
          const add = store.add(object);
          add.onsuccess = function () {
            resolve(add.result);
          };
          break;
        case 'delete':
          store.delete(object._id);
          break;

        default:
          console.log('No method found');
          break;
      }

      tx.oncomplete = function (e) {
        db.close();
      };
      // if (method === 'get') {
      //   store.get(object._id).onsuccess = function (e) {
      //     resolve(e.target.result);
      //   };
      // } else if (method === 'put') {
      //   store.put(object).onsuccess = function (e) {
      //     resolve(e.target.result);
      //   };
      // } else if (method === 'delete') {
      //   store.delete(object._id).onsuccess = function (e) {
      //     resolve(e.target.result);
      //   };
      // }
    };
  });
}

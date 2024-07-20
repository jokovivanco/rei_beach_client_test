const keys = ['order-cart'] as const;

type Key = (typeof keys)[number];

class StorageService {
  static getItem<T>(key: Key) {
    const data = localStorage.getItem(key);
    if (!data) return [];
    return JSON.parse(data) as T;
  }

  static setItem<T>(key: Key, item: T) {
    localStorage.setItem(key, JSON.stringify(item));
  }
}

export function getOrderCart(): any[] {
  return StorageService.getItem('order-cart');
}

export function addOrderCart(item: any) {
  let currentItems = getOrderCart();
  const exist = currentItems.find((current) => current.id === item.id);
  if (exist) {
    exist.quantity += item.quantity;
    currentItems = currentItems.map((current) =>
      current.id === item.id ? exist : current,
    );
  } else {
    currentItems = [...currentItems, item];
  }

  StorageService.setItem('order-cart', currentItems);
}

import { io } from 'socket.io-client';

export const itemSocket = io('http://localhost:5000/items', {
  autoConnect: false,
});
export const categorySocket = io('http://localhost:5000/categories', {
  autoConnect: false,
});
export const inboundSocket = io('http://localhost:5000/inbound', {
  autoConnect: false,
});
export const outboundSocket = io('http://localhost:5000/outbound', {
  autoConnect: false,
});

// "use client";
// import { useEffect, useState } from "react";

// export default function Price() {
//   const [price, setPrice] = useState(null);

//   useEffect(() => {
//     const ws = new WebSocket(
//       "wss://stream.binance.com:9443/stream?streams=btcusdt@trade/ethusdt@trade"
//     );

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       setPrice(data.p);
//       console.log("Price ---->",price)
//       console.log("---Data--->",data)
//     };

//     return () => ws.close();
//   }, []);

//   return (
//     <div>
//       <h1>BTC Price</h1>
//       <p>{price}</p>
//     </div>
//   );
// }